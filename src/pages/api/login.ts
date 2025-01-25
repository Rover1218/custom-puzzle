import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/jwt';
import connectDB from '../../lib/mongodb';
import User from '../../models/User';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // Update CORS headers
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', process.env.NEXTAUTH_URL || 'https://custom-puzzle-six.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            message: 'Method not allowed'
        });
    }

    try {
        await connectDB();
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Missing credentials'
            });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const token = signToken({
            id: user._id,
            username: user.username,
        });

        return res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id.toString(),
                username: user.username,
                email: user.email || null,
                fullName: user.fullName || null
            }
        });
    } catch (error: any) {
        console.error("Login error:", error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}
