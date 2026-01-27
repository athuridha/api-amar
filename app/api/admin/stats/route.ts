import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
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
        const totalLicenses = await prisma.license.count();

        // Get active licenses
        const activeLicenses = await prisma.license.count({
            where: { is_active: true }
        });

        // Get today's usage stats
        const todayUsage = await prisma.usageLog.findMany({
            where: { date: today },
            select: { count: true }
        });

        const totalScrapesToday = todayUsage?.reduce((sum, row) => sum + (row.count || 0), 0) || 0;

        // Get unique devices today
        const todayDevices = await prisma.usageLog.findMany({
            where: { date: today },
            select: { device_id: true, license_id: true }
        });

        const uniqueUsersToday = todayDevices?.length || 0;

        // Get all licenses with usage
        const licenses = await prisma.license.findMany({
            orderBy: { created_at: 'desc' }
        });

        // Get recent usage logs
        const recentUsage = await prisma.usageLog.findMany({
            orderBy: { date: 'desc' },
            take: 50
        });

        // NEW: Get all customers (unique device IDs with their usage)
        const customersRaw = await prisma.usageLog.findMany({
            where: { device_id: { not: null } },
            orderBy: { date: 'desc' },
            select: { device_id: true, ip_address: true, user_agent: true, count: true, date: true }
        });

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
        const suspiciousRaw = await prisma.usageLog.findMany({
            where: { ip_address: { not: null }, device_id: { not: null } },
            select: { ip_address: true, device_id: true, date: true }
        });

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
            if (row.device_id) {
                suspiciousMap.get(key).deviceIds.add(row.device_id);
            }
        });

        const suspicious = Array.from(suspiciousMap.values())
            .filter((item: any) => item.deviceIds.size >= 2) // 2+ device IDs = suspicious
            .map((item: any) => ({
                ipAddress: item.ipAddress,
                date: item.date,
                deviceCount: item.deviceIds.size,
                deviceIds: Array.from(item.deviceIds).slice(0, 5) // Show max 5
            }))
            .sort((a: any, b: any) => b.deviceCount - a.deviceCount)
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

