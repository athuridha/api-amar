import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

        // Bypass license check - Always return success
        const mockLicense = {
            plan: 'Lifetime Pro',
            email: 'unlimited@access.com',
            dailyLimit: 999999,
            usedToday: 0,
            remaining: 999999,
            expiresAt: null
        };

        return NextResponse.json({
            success: true,
            license: mockLicense
        });

    } catch (error) {
        console.error('Validate error:', error);
        return NextResponse.json(
            { success: false, error: 'Server error' },
            { status: 500 }
        );
    }
}
