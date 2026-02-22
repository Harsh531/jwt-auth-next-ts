import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/requireAuth';

export async function GET(request: NextRequest) {
    try {
        const { userId } = requireAuth(request);

        return NextResponse.json(
            {
                message: 'Protected data',
                userId,
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }
}