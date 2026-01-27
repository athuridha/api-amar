import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        // Test database connection
        await prisma.$queryRaw`SELECT 1`;
        // If no error, connection is good

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
