import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Check usage (for guests or licensed users)
export async function POST(request: NextRequest) {
    try {
        const { deviceId, licenseKey } = await request.json();

        if (!deviceId) {
            return NextResponse.json(
                { success: false, error: 'Device ID required' },
                { status: 400 }
            );
        }

        const today = new Date().toISOString().split('T')[0];
        let dailyLimit = 500; // Default free limit
        let plan = 'free';
        let licenseId = null;

        // Check if has valid license
        if (licenseKey) {
            const { data: license } = await supabase
                .from('licenses')
                .select('*')
                .eq('license_key', licenseKey)
                .eq('is_active', true)
                .single();

            if (license) {
                // Check expiration
                if (!license.expires_at || new Date(license.expires_at) > new Date()) {
                    dailyLimit = license.daily_limit || 10000;
                    plan = license.plan;
                    licenseId = license.id;
                }
            }
        }

        // Get today's usage (by device or license)
        let usageQuery = supabase
            .from('usage_logs')
            .select('count')
            .eq('date', today);

        if (licenseId) {
            usageQuery = usageQuery.eq('license_id', licenseId);
        } else {
            usageQuery = usageQuery.eq('device_id', deviceId);
        }

        const { data: usage } = await usageQuery.single();
        const currentUsage = usage?.count || 0;
        const remaining = Math.max(0, dailyLimit - currentUsage);

        return NextResponse.json({
            success: true,
            plan: plan,
            dailyLimit: dailyLimit,
            usedToday: currentUsage,
            remaining: remaining,
            hasLicense: !!licenseId
        });

    } catch (error) {
        console.error('Check error:', error);
        return NextResponse.json(
            { success: false, error: 'Server error' },
            { status: 500 }
        );
    }
}
