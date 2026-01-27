import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

// MOCK ADMIN LOGIN (Since we are migrating fast and maybe didn't create Admin table)
// Or better: Use environment variable for simple admin auth
export async function POST(request: NextRequest) {
    try {
        const { username, password } = await request.json();

        if (!username || !password) {
            return NextResponse.json(
                { success: false, error: 'Username and password required' },
                { status: 400 }
            );
        }

        const passwordHash = crypto.createHash('sha256').update(password).digest('hex');

        // Check in database
        const admin = await prisma.admin.findUnique({
            where: { username: username }
        });

        if (admin && admin.password_hash === passwordHash) {
            const response = NextResponse.json({ success: true, username: admin.username });
            response.cookies.set('admin_auth', admin.id, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 // 24 hours
            });
            return response;
        }

        return NextResponse.json(
            { success: false, error: 'Invalid username or password' },
            { status: 401 }
        );

    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Server error' },
            { status: 500 }
        );
    }
}
