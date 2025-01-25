import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface UserToken {
    id: string;
    username: string;
    email: string;
}

export interface User {
    username?: string;
    email?: string;
    id: string;
}

// Add custom interface for extended request
interface ExtendedNextApiRequest extends NextApiRequest {
    user?: UserToken;
}

export const verifyToken = (token: string): UserToken | null => {
    try {
        return jwt.verify(token, JWT_SECRET) as UserToken;
    } catch {
        return null;
    }
};

export const authMiddleware = async (
    req: ExtendedNextApiRequest,
    res: NextApiResponse,
    next: () => void
) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            throw new Error('No token provided');
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            throw new Error('Invalid token');
        }

        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
    }
};

export const getAuthenticatedUser = (): { token: string; user: User } | null => {
    if (typeof window === 'undefined') return null;

    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (!token || !user) return null;

    try {
        return {
            token,
            user: JSON.parse(user)
        };
    } catch {
        return null;
    }
};
