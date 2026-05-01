import { JwtPayload, Secret, verify } from 'jsonwebtoken';

export interface MotorAdminToken extends JwtPayload {
    email?: string;
}
interface VerifyResult {
    error: { message: string } | null;
    authentication: MotorAdminToken | null;
}

export const verifyMotoradminJwt = async (authHeader: string | null): Promise<VerifyResult> => {
    const jwtToken = authHeader?.split(' ')[1] || '';
    if (!jwtToken) {
        return { error: { message: 'no token' }, authentication: null };
    }
    if (!process.env.SECRET_KEY_BASE) {
        return { error: { message: 'API not configured' }, authentication: null };
    }

    try {
        const authentication = await new Promise<MotorAdminToken>((resolve, reject) => {
            verify(jwtToken, process.env.SECRET_KEY_BASE as Secret, (err, decoded) => {
                if (err) {
                    return reject(err);
                }

                if (typeof decoded === 'string') {
                    return reject(new Error('Invalid token payload format'));
                }

                resolve(decoded as MotorAdminToken);
            });
        });
        return { error: null, authentication };
    } catch {
        return { error: { message: 'Unauthorized' }, authentication: null };
    }
};

export default verifyMotoradminJwt;
