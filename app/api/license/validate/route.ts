import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Validate license and check usage
export async function POST(request: NextRequest) {
    try {
        const { licenseKey } = await request.json();

        if (!licenseKey) {
            return NextResponse.json(
                { success: false, error: 'License key required' },
                { status: 400 }
            );
        }

        // Get license from database
        const { data: license, error: licenseError } = await supabase
            .from('licenses')
            .select('*')
            .eq('license_key', licenseKey)
            .eq('is_active', true)
            .single();

        if (licenseError || !license) {
            return NextResponse.json(
                { success: false, error: 'Invalid or inactive license' },
                { status: 401 }
            );
        }

        // Check expiration
        if (license.expires_at && new Date(license.expires_at) < new Date()) {
            return NextResponse.json(
                { success: false, error: 'License expired' },
                { status: 401 }
            );
        }

        // Get today's date
        const today = new Date().toISOString().split('T')[0];

        // Get today's usage
        const { data: usage } = await supabase
            .from('usage_logs')
            .select('count')
            .eq('license_id', license.id)
            .eq('date', today)
            .single();

        const currentUsage = usage?.count || 0;
        const dailyLimit = license.daily_limit || 500;
        const remaining = Math.max(0, dailyLimit - currentUsage);

        return NextResponse.json({
            success: true,
            license: {
                plan: license.plan,
                email: license.email,
                dailyLimit: dailyLimit,
                usedToday: currentUsage,
                remaining: remaining,
                expiresAt: license.expires_at
            }
        });

    } catch (error) {
        console.error('Validate error:', error);
        return NextResponse.json(
            { success: false, error: 'Server error' },
            { status: 500 }
        );
    }
}
