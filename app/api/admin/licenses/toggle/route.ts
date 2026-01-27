import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

// Check auth
async function isAuthenticated() {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('admin_auth');
    return !!authCookie?.value;
}

export async function POST(request: NextRequest) {
    if (!await isAuthenticated()) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id, is_active } = await request.json();

        if (!id || typeof is_active !== 'boolean') {
            return NextResponse.json({ success: false, error: 'Invalid parameters' }, { status: 400 });
        }

        const data = await prisma.license.update({
            where: { id },
            data: { is_active }
        });

        return NextResponse.json({ success: true, license: data });

    } catch (error) {
        console.error('Toggle license error:', error);
        return NextResponse.json({ success: false, error: 'Failed to update license' }, { status: 500 });
    }
}
