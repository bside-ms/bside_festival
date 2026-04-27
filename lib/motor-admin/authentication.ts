import { verify, Secret } from 'jsonwebtoken';

export const verifyMotoradminJwt = async (authHeader: string | null) => {
    const [_, jwtToken] = authHeader?.split(' ') || ["", ""];
    if (!jwtToken) {
        return { error: { message: 'no token' }, authentication: null };
    }
    if (!process.env.SECRET_KEY_BASE) {
        return { error: { message: 'API not configured' }, authentication: null };
    }

    try {
        const authentication = await new Promise((resolve, reject) => {
            verify(jwtToken, process.env.SECRET_KEY_BASE as Secret, (err, authentication) => {
                if (err) reject(err);
                else resolve(authentication);
            });
        });
        return { error: null, authentication };
    } catch (err) {
        return { error: { message: 'Unauthorized' }, authentication: null };
    }
};

export default verifyMotoradminJwt;
