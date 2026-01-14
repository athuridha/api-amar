import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase } from '@/lib/supabase';

// Generate a random license key
function generateLicenseKey() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const segments = 4;
    const segmentLength = 4;

    let key = '';
    for (let i = 0; i < segments; i++) {
        for (let j = 0; j < segmentLength; j++) {
            key += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        if (i < segments - 1) key += '-';
    }
    return key;
}

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

        // 2. Handle 'order_created'
        if (eventName === 'order_created') {
            const { attributes } = body.data;
            const { user_email, user_name } = attributes;
            // You can map 'first_order_item.variant_id' to specific plans if you have multiple

            // 3. Generate License
            const licenseKey = generateLicenseKey();
            const plan = 'Pro'; // Default to Pro for now
            const limit = 50000; // Pro limit

            // 4. Save to Database
            const { error } = await supabase
                .from('licenses')
                .insert([
                    {
                        key: licenseKey,
                        email: user_email,
                        plan: plan,
                        limit: limit,
                        status: 'active',
                        created_at: new Date().toISOString()
                    }
                ]);

            if (error) {
                console.error('DB Error:', error);
                return NextResponse.json({ error: 'Failed to create license' }, { status: 500 });
            }

            console.log(`License created for ${user_email}: ${licenseKey}`);

            // 5. Important: Ensure Lemonsqueezy sends this key to the user
            // Ideally, you'd use Lemonsqueezy API to update the order with the license key
            // or send your own email here (using Resend/SendGrid).
            // For MVP, user might need to check their license in your dash or you email manually if not automated.

            return NextResponse.json({ received: true, license: licenseKey });
        }

        return NextResponse.json({ received: true });

    } catch (e: any) {
        console.error('Webhook Error:', e);
        return NextResponse.json({ error: e.message }, { status: 400 });
    }
}
