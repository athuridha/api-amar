import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// --- SECRET CONFIGURATION (Moving logic to server) ---
// This is the "Engine Map" that the client needs to work.
// Without this, the extension is blind.
const SCRAPER_CONFIG = {
    selectors: {
        card: [
            '[data-test-id^="srp-listing-card-"]',
            '[data-test-id^="viewport-property-card-"]',
            '.property-card',
            'article[data-test-id]'
        ],
        title: [
            'h2',                              // Direct h2 (most reliable)
            'h2[data-test-id*="title"]',
            'h2 a',
            '[class*="title"]'
        ],
        url: [
            'a[href*="/properti/"]',
            'a[href*="/perumahan-baru/"]',
            'a[href^="/"]'                     // Fallback for any link
        ],
        price: [
            'span.text-primary.font-bold',     // Current DOM structure
            '[data-test-id*="price"]',
            '[class*="price"]',
            'span.font-bold'                   // Fallback
        ],
        location: [
            '[class*="text-gray"]',            // Updated for current DOM
            '[class*="location"]',
            '[class*="address"]',
            '.entity-item-text'
        ],
        specs: {
            bedroom: 'bedroom',
            bathroom: 'bathroom',
            area_land: 'LT',
            area_build: 'LB'
        },
        image: 'img'
    },
    settings: {
        scrollRounds: 30,
        scrollPause: 500
    }
};

const GUEST_DAILY_LIMIT = 500;

export async function POST(request: NextRequest) {
    try {
        const { licenseKey, deviceId } = await request.json();

        // 1. Check for License Key (Priority)
        if (licenseKey) {
            const { data: license, error } = await supabase
                .from('licenses')
                .select('*')
                .eq('license_key', licenseKey)
                .eq('is_active', true)
                .single();

            if (error || !license) {
                return NextResponse.json({ success: false, error: 'Invalid or inactive license key' }, { status: 401 });
            }

            // Check Expiry
            if (license.expires_at && new Date(license.expires_at) < new Date()) {
                return NextResponse.json({ success: false, error: 'License expired' }, { status: 403 });
            }

            // Check Daily Usage for License
            const today = new Date().toISOString().split('T')[0];
            const { data: usage } = await supabase
                .from('usage_logs')
                .select('count')
                .eq('license_id', license.id)
                .eq('date', today)
                .single();

            const currentUsage = usage?.count || 0;
            if (currentUsage >= license.daily_limit) {
                return NextResponse.json({ success: false, error: 'Daily limit reached' }, { status: 429 });
            }

            // Valid License -> Return Config + Limit info
            return NextResponse.json({
                success: true,
                config: SCRAPER_CONFIG,
                user: { type: 'license', plan: license.plan, limit: license.daily_limit, usage: currentUsage }
            });
        }

        // 2. Check Guest Mode (No License)
        if (deviceId) {
            const today = new Date().toISOString().split('T')[0];

            // Calculate total guest usage for this device today
            const { data: usage } = await supabase
                .from('usage_logs')
                .select('count')
                .eq('device_id', deviceId)
                .is('license_id', null) // Only count guest usage
                .eq('date', today)
                .single();

            const currentUsage = usage?.count || 0;

            if (currentUsage >= GUEST_DAILY_LIMIT) {
                return NextResponse.json({
                    success: false,
                    error: 'Guest limit reached. Please buy a license.'
                }, { status: 429 });
            }

            // Valid Guest -> Return Config
            return NextResponse.json({
                success: true,
                config: SCRAPER_CONFIG,
                user: { type: 'guest', limit: GUEST_DAILY_LIMIT, usage: currentUsage }
            });
        }

        return NextResponse.json({ success: false, error: 'License key or Device ID required' }, { status: 400 });

    } catch (error) {
        console.error('Config fetch error:', error);
        return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
    }
}
