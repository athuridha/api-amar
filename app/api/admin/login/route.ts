import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import crypto from 'crypto';

function hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex');
}

export async function POST(request: NextRequest) {
    try {
        const { password } = await request.json();

        if (!password) {
            return NextResponse.json(
                { success: false, error: 'Password required' },
                { status: 400 }
            );
        }

        const passwordHash = hashPassword(password);

        // Check password in database
        const { data: settings, error } = await supabase
            .from('admin_settings')
            .select('password_hash')
            .eq('id', 1)
            .single();

        if (error || !settings) {
            // Fallback to hardcoded password if table doesn't exist
            if (password === 'admin123') {
                const response = NextResponse.json({ success: true });
                response.cookies.set('admin_auth', 'authenticated', {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 60 * 60 * 24
                });
                return response;
            }
            return NextResponse.json(
                { success: false, error: 'Invalid password' },
                { status: 401 }
            );
        }

        if (settings.password_hash !== passwordHash) {
            return NextResponse.json(
                { success: false, error: 'Invalid password' },
                { status: 401 }
            );
        }

        const response = NextResponse.json({ success: true });
        response.cookies.set('admin_auth', 'authenticated', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24
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
