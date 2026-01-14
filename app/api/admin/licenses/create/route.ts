import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';
import crypto from 'crypto';

// Check auth
async function isAuthenticated() {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('admin_auth');
    return !!authCookie?.value;
}

function generateLicenseKey(): string {
    // Format: TEAM-XXXX-XXXX-XXXX
    const randomBytes = crypto.randomBytes(6).toString('hex').toUpperCase();
    const part1 = randomBytes.substring(0, 4);
    const part2 = randomBytes.substring(4, 8);
    const part3 = crypto.randomBytes(2).toString('hex').toUpperCase();
    return `TEAM-${part1}-${part2}-${part3}`;
}

export async function POST(request: NextRequest) {
    if (!await isAuthenticated()) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { email, plan, limit, durationDays } = body;

        if (!email || !plan) {
            return NextResponse.json({ success: false, error: 'Email and plan are required' }, { status: 400 });
        }

        const licenseKey = generateLicenseKey();

        // Calculate expiry
        let expiresAt = null;
        if (durationDays && durationDays > 0) {
            const date = new Date();
            date.setDate(date.getDate() + parseInt(durationDays));
            expiresAt = date.toISOString();
        }

        // Insert into DB
        const { data, error } = await supabase
            .from('licenses')
            .insert([
                {
                    license_key: licenseKey,
                    email,
                    plan,
                    daily_limit: parseInt(limit) || 500,
                    expires_at: expiresAt,
                    is_active: true
                }
            ])
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ success: true, license: data });

    } catch (error) {
        console.error('Create license error:', error);
        return NextResponse.json({ success: false, error: 'Failed to create license' }, { status: 500 });
    }
}
