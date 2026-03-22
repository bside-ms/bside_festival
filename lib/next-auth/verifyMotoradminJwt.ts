import { NextResponse } from 'next/server';
import { verify, Secret } from 'jsonwebtoken';

export const verifyMotoradminJwt = async (authHeader: string | null) => {
    const [_, jwtToken] = authHeader?.split(' ') || ["", ""];
    if (!jwtToken) {
        return { error: NextResponse.json({ status: 'no token' }), decoded: null };
    }
    if (!process.env.SECRET_KEY_BASE) {
        return { error: NextResponse.json({ error: 'API not configured' }), decoded: null };
    }

    try {
        const decoded = await new Promise((resolve, reject) => {
            verify(jwtToken, process.env.SECRET_KEY_BASE as Secret, (err, decoded) => {
                if (err) reject(err);
                else resolve(decoded);
            });
        });
        return { error: null, decoded };
    } catch (err) {
        return { error: NextResponse.json({ error: 'Unauthorized' }), decoded: null };
    }
};

export default verifyMotoradminJwt;
