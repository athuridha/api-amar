import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
    try {
        // 1. Verify Signature
        const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
        if (!secret) {
            console.error('LEMONSQUEEZY_WEBHOOK_SECRET not set');
            return NextResponse.json({ error: 'Server config error' }, { status: 500 });
        }

        const rawBody = await req.text();
        const signature = req.headers.get('x-signature');

        if (!signature) {
            return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
        }

        const hmac = crypto.createHmac('sha256', secret);
        const digest = hmac.update(rawBody).digest('hex');

        if (digest !== signature) {
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }

        const body = JSON.parse(rawBody);
        const eventName = body.meta.event_name;

        // 2. Handle 'license_key_created' OR 'order_created' (for testing)
        if (eventName === 'license_key_created' || eventName === 'order_created') {
            const { attributes } = body.data;
            let { user_email, user_name, key, status } = attributes;

            // For 'order_created' simulation, key might be missing.
            if (!key && eventName === 'order_created') {
                console.log('Simulation or Order Created: No key found, using placeholder for test.');
                key = 'TEST-KEY-' + Date.now();
                status = 'active';
            }

            // The status from Lemonsqueezy is usually 'active' or 'inactive'
            const isActive = status === 'active';

            let plan = 'Pro';
            let limit = 50000; // Default (Lifetime or fallback)
            let expiresAt = null;

            // Dynamic Limit & Expiration Logic based on Product Name
            const variantName = attributes.variant_name || '';

            if (variantName.includes('Daily')) {
                plan = 'Daily Pass';
                limit = 5000;

                // Set expiration to 2 days from now
                const date = new Date();
                date.setDate(date.getDate() + 2);
                expiresAt = date.toISOString();

            } else if (variantName.includes('Monthly')) {
                plan = 'Monthly Pro';
                limit = 25000;

                // Set expiration to 30 days from now
                const date = new Date();
                date.setDate(date.getDate() + 30);
                expiresAt = date.toISOString();

            } else if (variantName.includes('Lifetime')) {
                plan = 'Lifetime';
                limit = 50000;
            } else {
                // Default fallback
                limit = 25000;
            }

            if (!user_email) {
                user_email = 'test@example.com';
            }

            const { error } = await supabase
                .from('licenses')
                .upsert([
                    {
                        license_key: key,      // Correct column name
                        email: user_email,
                        name: user_name || 'Test User',       // Map name to database column
                        plan: plan,
                        daily_limit: limit,    // Correct column name
                        is_active: isActive,   // Correct boolean column
                        created_at: new Date().toISOString(),
                        expires_at: expiresAt  // Save expiration date
                    }
                ], { onConflict: 'license_key' });

            if (error) {
                console.error('DB Error:', error);
                return NextResponse.json({ error: 'Failed to save license' }, { status: 500 });
            }

            console.log(`License saved for ${user_email}: ${key}`);
            return NextResponse.json({ received: true });
        }

        return NextResponse.json({ received: true });

    } catch (e: any) {
        console.error('Webhook Error:', e);
        return NextResponse.json({ error: e.message }, { status: 400 });
    }
}
