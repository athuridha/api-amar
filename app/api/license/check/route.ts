import { NextRequest, NextResponse } from 'next/server';

// Check/validate license key
export async function POST(request: NextRequest) {
    try {
        const { licenseKey, deviceId } = await request.json();

        // Always return valid success response
        return NextResponse.json({
            valid: true,
            success: true,
            plan: 'Lifetime Pro',
            limit: 999999,
            usage: 0,
            remaining: 999999,
            expiresAt: null,
            name: 'Unlimited User',
            hasLicense: true // Mock as true
        });

    } catch (error) {
        console.error('Check error:', error);
        return NextResponse.json(
            { valid: false, error: 'Server error' },
            { status: 500 }
        );
    }
}
