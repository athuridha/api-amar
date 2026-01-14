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

        // NEW: Get all customers (unique device IDs with their usage)
        const { data: customersRaw } = await supabase
            .from('usage_logs')
            .select('device_id, ip_address, user_agent, count, date')
            .not('device_id', 'is', null)
            .order('date', { ascending: false });

        // Aggregate customers by device_id
        const customerMap = new Map();
        customersRaw?.forEach(row => {
            if (!row.device_id) return;
            const existing = customerMap.get(row.device_id);
            if (existing) {
                existing.totalScrapes += row.count || 0;
                existing.lastActive = row.date > existing.lastActive ? row.date : existing.lastActive;
            } else {
                customerMap.set(row.device_id, {
                    deviceId: row.device_id,
                    ipAddress: row.ip_address || 'Unknown',
                    userAgent: row.user_agent || 'Unknown',
                    totalScrapes: row.count || 0,
                    lastActive: row.date
                });
            }
        });
        const customers = Array.from(customerMap.values())
            .sort((a, b) => b.totalScrapes - a.totalScrapes)
            .slice(0, 100); // Top 100 customers

        // NEW: Get suspicious activity (IPs with multiple device IDs)
        const { data: suspiciousRaw } = await supabase
            .from('usage_logs')
            .select('ip_address, device_id, date')
            .not('ip_address', 'is', null)
            .not('device_id', 'is', null);

        // Group by IP and date
        const suspiciousMap = new Map();
        suspiciousRaw?.forEach(row => {
            const key = `${row.ip_address}-${row.date}`;
            if (!suspiciousMap.has(key)) {
                suspiciousMap.set(key, {
                    ipAddress: row.ip_address,
                    date: row.date,
                    deviceIds: new Set()
                });
            }
            suspiciousMap.get(key).deviceIds.add(row.device_id);
        });

        const suspicious = Array.from(suspiciousMap.values())
            .filter(item => item.deviceIds.size >= 2) // 2+ device IDs = suspicious
            .map(item => ({
                ipAddress: item.ipAddress,
                date: item.date,
                deviceCount: item.deviceIds.size,
                deviceIds: Array.from(item.deviceIds).slice(0, 5) // Show max 5
            }))
            .sort((a, b) => b.deviceCount - a.deviceCount)
            .slice(0, 50); // Top 50 suspicious

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
            recentUsage: recentUsage || [],
            customers: customers,
            suspicious: suspicious
        });

    } catch (error) {
        console.error('Stats error:', error);
        return NextResponse.json(
            { success: false, error: 'Server error' },
            { status: 500 }
        );
    }
}

