import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';

export async function authMiddleware(req: NextRequest) {
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return NextResponse.json(
            { message: 'Unauthorized' },
            { status: 401 }
        );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
        return NextResponse.json(
            { message: 'Invalid token' },
            { status: 401 }
        );
    }

    return NextResponse.next();
}
