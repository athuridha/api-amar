import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Get client IP from request
function getClientIP(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for');
    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }
    const realIP = request.headers.get('x-real-ip');
    if (realIP) {
        return realIP;
    }
    return 'unknown';
}

// Track scrape usage (for guests or licensed users)
export async function POST(request: NextRequest) {
    try {
        const { deviceId, licenseKey, count = 1, userAgent } = await request.json();

        // Optional: Capture stats if deviceId is present, but don't block
        if (deviceId) {
            const clientIP = getClientIP(request);
            const clientUA = userAgent || request.headers.get('user-agent') || 'unknown';
            const today = new Date().toISOString().split('T')[0];

            try {
                // Try to log usage, but fail silently if DB error
                const existingUsage = await prisma.usageLog.findFirst({
                    where: {
                        date: today,
                        device_id: deviceId
                    }
                });

                if (existingUsage) {
                    await prisma.usageLog.update({
                        where: { id: existingUsage.id },
                        data: {
                            count: (existingUsage.count || 0) + count,
                            ip_address: clientIP,
                            user_agent: clientUA,
                            updated_at: new Date()
                        }
                    });
                } else {
                    await prisma.usageLog.create({
                        data: {
                            device_id: deviceId,
                            date: today,
                            count: count,
                            ip_address: clientIP,
                            user_agent: clientUA
                        }
                    });
                }
            } catch (dbError) {
                // Ignore DB errors for usage logging
                console.error("Usage logging failed", dbError);
            }
        }

        return NextResponse.json({
            success: true,
            allowed: true,
            used: 0,
            remaining: 999999,
            limit: 999999,
            plan: 'Lifetime Pro'
        });

    } catch (error) {
        console.error('Usage error:', error);
        // Even on error, return allowed
        return NextResponse.json({
            success: true,
            allowed: true,
            used: 0,
            remaining: 999999
        });
    }
}

