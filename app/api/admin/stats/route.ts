import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';

// Check auth
async function isAuthenticated() {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('admin_auth');
    return !!authCookie?.value;
}

export async function GET(request: NextRequest) {
    // Check authentication
    if (!await isAuthenticated()) {
        return NextResponse.json(
            { success: false, error: 'Unauthorized' },
            { status: 401 }
        );
    }

    try {
        const today = new Date().toISOString().split('T')[0];

        // Get total licenses
        const { count: totalLicenses } = await supabase
            .from('licenses')
            .select('*', { count: 'exact', head: true });

        // Get active licenses
        const { count: activeLicenses } = await supabase
            .from('licenses')
            .select('*', { count: 'exact', head: true })
            .eq('is_active', true);

        // Get today's usage stats
        const { data: todayUsage } = await supabase
            .from('usage_logs')
            .select('count')
            .eq('date', today);

        const totalScrapesToday = todayUsage?.reduce((sum, row) => sum + (row.count || 0), 0) || 0;

        // Get unique devices today
        const { data: todayDevices } = await supabase
            .from('usage_logs')
            .select('device_id, license_id')
            .eq('date', today);

        const uniqueUsersToday = todayDevices?.length || 0;

        // Get all licenses with usage
        const { data: licenses } = await supabase
            .from('licenses')
            .select('id, license_key, email, plan, daily_limit, is_active, created_at, expires_at')
            .order('created_at', { ascending: false });

        // Get recent usage logs
        const { data: recentUsage } = await supabase
            .from('usage_logs')
            .select('*')
            .order('date', { ascending: false })
            .limit(50);

        return NextResponse.json({
            success: true,
            stats: {
                totalLicenses: totalLicenses || 0,
                activeLicenses: activeLicenses || 0,
                totalScrapesToday,
                uniqueUsersToday,
                date: today
            },
            licenses: licenses || [],
            recentUsage: recentUsage || []
        });

    } catch (error) {
        console.error('Stats error:', error);
        return NextResponse.json(
            { success: false, error: 'Server error' },
            { status: 500 }
        );
    }
}
