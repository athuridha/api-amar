import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Track scrape usage (for guests or licensed users)
export async function POST(request: NextRequest) {
    try {
        const { deviceId, licenseKey, count = 1 } = await request.json();

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
                if (!license.expires_at || new Date(license.expires_at) > new Date()) {
                    dailyLimit = license.daily_limit || 10000;
                    plan = license.plan;
                    licenseId = license.id;
                }
            }
        }

        // Get current usage
        let usageQuery = supabase
            .from('usage_logs')
            .select('id, count')
            .eq('date', today);

        if (licenseId) {
            usageQuery = usageQuery.eq('license_id', licenseId);
        } else {
            usageQuery = usageQuery.eq('device_id', deviceId);
        }

        const { data: existingUsage } = await usageQuery.single();
        const currentUsage = existingUsage?.count || 0;

        // Check limit
        if (currentUsage + count > dailyLimit) {
            return NextResponse.json({
                success: false,
                error: 'Daily limit reached',
                limit: dailyLimit,
                used: currentUsage,
                remaining: 0,
                plan: plan
            }, { status: 429 });
        }

        // Update or insert usage
        if (existingUsage) {
            await supabase
                .from('usage_logs')
                .update({
                    count: currentUsage + count,
                    updated_at: new Date().toISOString()
                })
                .eq('id', existingUsage.id);
        } else {
            await supabase
                .from('usage_logs')
                .insert({
                    license_id: licenseId,
                    device_id: licenseId ? null : deviceId,
                    date: today,
                    count: count
                });
        }

        const newUsage = currentUsage + count;
        const remaining = Math.max(0, dailyLimit - newUsage);

        return NextResponse.json({
            success: true,
            allowed: true,
            used: newUsage,
            remaining: remaining,
            limit: dailyLimit,
            plan: plan
        });

    } catch (error) {
        console.error('Usage error:', error);
        return NextResponse.json(
            { success: false, error: 'Server error' },
            { status: 500 }
        );
    }
}
