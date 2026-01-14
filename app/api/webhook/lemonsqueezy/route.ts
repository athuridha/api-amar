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
            const { user_email, user_name, key, status } = attributes;
            // The status from Lemonsqueezy is usually 'active' or 'inactive'
            const isActive = status === 'active';

            // We need to determine the 'limit' based on the product.
            // Since Lemonsqueezy payload for license creation might not directly give the Variant Name easily
            // without fetching relationships, we can try to guess from the API or default to Pro.
            // For now, let's default to Pro limits.

            let plan = 'Pro';
            let limit = 50000;

            // Simple logic:
            // You can query Lemonsqueezy API here if you need exact variant name validation.
            // For MVP, if you have distinct limits, handle them here. 
            // Or just give everyone 50k since daily pass users expire anyway.

            const { error } = await supabase
                .from('licenses')
                .upsert([
                    {
                        license_key: key,      // Correct column name
                        email: user_email,
                        name: user_name,       // Map name to database column
                        plan: plan,
                        daily_limit: limit,    // Correct column name
                        is_active: isActive,   // Correct boolean column
                        created_at: new Date().toISOString()
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
