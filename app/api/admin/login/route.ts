import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Simple admin password - CHANGE THIS!
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export async function POST(request: NextRequest) {
    try {
        const { password } = await request.json();

        if (password === ADMIN_PASSWORD) {
            // Set auth cookie
            const response = NextResponse.json({ success: true });
            response.cookies.set('admin_auth', 'authenticated', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 // 24 hours
            });
            return response;
        }

        return NextResponse.json(
            { success: false, error: 'Invalid password' },
            { status: 401 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Server error' },
            { status: 500 }
        );
    }
}
