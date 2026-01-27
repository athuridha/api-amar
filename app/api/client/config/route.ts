import { NextRequest, NextResponse } from 'next/server';
// import { supabase } from '@/lib/supabase'; // Removed

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
        // ALWAYS RETURN SUCCESS (License enforcement removed)
        return NextResponse.json({
            success: true,
            config: SCRAPER_CONFIG,
            user: { type: 'license', plan: 'Lifetime Pro', limit: 999999, usage: 0 }
        });

    } catch (error) {
        console.error('Config fetch error:', error);
        return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
    }
}
