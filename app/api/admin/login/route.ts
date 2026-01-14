import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import crypto from 'crypto';

function hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex');
}

export async function POST(request: NextRequest) {
    try {
        const { username, password } = await request.json();

        if (!username || !password) {
            return NextResponse.json(
                { success: false, error: 'Username and password required' },
                { status: 400 }
            );
        }

        const passwordHash = hashPassword(password);

        console.log('[Login Attempt]', {
            username,
            passwordLength: password.length,
            generatedHash: passwordHash
        });

        // Check in database
        const { data: admin, error } = await supabase
            .from('admins')
            .select('id, username, password_hash')
            .eq('username', username)
            .single();

        if (error) {
            console.error('[Login Error] Supabase error:', error);
            return NextResponse.json(
                { success: false, error: 'Database error' },
                { status: 500 }
            );
        }

        if (!admin) {
            console.log('[Login Failed] User not found');
            return NextResponse.json(
                { success: false, error: 'Invalid username or password' },
                { status: 401 }
            );
        }

        if (admin.password_hash !== passwordHash) {
            console.log('[Login Failed] Hash mismatch', {
                expected: admin.password_hash,
                actual: passwordHash
            });
            return NextResponse.json(
                { success: false, error: 'Invalid username or password' },
                { status: 401 }
            );
        }

        // Set auth cookie
        const response = NextResponse.json({ success: true, username: admin.username });
        response.cookies.set('admin_auth', admin.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 // 24 hours
        });

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { success: false, error: 'Server error' },
            { status: 500 }
        );
    }
}
