import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Check/validate license key
export async function POST(request: NextRequest) {
    try {
        const { licenseKey, deviceId } = await request.json();

        // License key validation mode
        if (licenseKey) {
            const { data: license } = await supabase
                .from('licenses')
                .select('*')
                .eq('license_key', licenseKey)
                .eq('is_active', true)
                .single();

            if (!license) {
                return NextResponse.json({
                    valid: false,
                    error: 'License key tidak ditemukan atau tidak aktif'
                });
            }

            // Check expiration
            if (license.expires_at && new Date(license.expires_at) <= new Date()) {
                return NextResponse.json({
                    valid: false,
                    error: 'License sudah expired'
                });
            }

            // Get today's usage for this license
            const today = new Date().toISOString().split('T')[0];
            const { data: usageData } = await supabase
                .from('usage_logs')
                .select('count')
                .eq('license_id', license.id)
                .eq('date', today)
                .single();

            const usedToday = usageData?.count || 0;
            const dailyLimit = license.daily_limit || 10000;
            const remaining = dailyLimit >= 999999 ? 999999 : Math.max(0, dailyLimit - usedToday);

            return NextResponse.json({
                valid: true,
                success: true,
                plan: license.plan,
                limit: dailyLimit,
                usage: usedToday,
                remaining: remaining,
                expiresAt: license.expires_at,
                name: license.name
            });
        }

        // Usage check mode (requires deviceId)
        if (!deviceId) {
            return NextResponse.json(
                { valid: false, error: 'License key or Device ID required' },
                { status: 400 }
            );
        }

        const today = new Date().toISOString().split('T')[0];
        let dailyLimit = 500;
        let plan = 'free';

        // Get today's usage by device
        const { data: usage } = await supabase
            .from('usage_logs')
            .select('count')
            .eq('date', today)
            .eq('device_id', deviceId)
            .single();

        const currentUsage = usage?.count || 0;
        const remaining = Math.max(0, dailyLimit - currentUsage);

        return NextResponse.json({
            success: true,
            valid: true,
            plan: plan,
            dailyLimit: dailyLimit,
            usedToday: currentUsage,
            remaining: remaining,
            hasLicense: false
        });

    } catch (error) {
        console.error('Check error:', error);
        return NextResponse.json(
            { valid: false, error: 'Server error' },
            { status: 500 }
        );
    }
}
