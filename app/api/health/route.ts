import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
    try {
        // Test database connection
        const { error } = await supabase
            .from('usage_logs')
            .select('id')
            .limit(1);

        if (error) {
            return NextResponse.json({
                status: 'error',
                error: 'Database connection failed'
            }, { status: 500 });
        }

        return NextResponse.json({
            status: 'ok',
            message: 'API is healthy',
            timestamp: new Date().toISOString()
        });

    } catch (e) {
        return NextResponse.json({
            status: 'error',
            error: 'Server error'
        }, { status: 500 });
    }
}
