import { NextRequest } from "next/server";
import verifyMotoradminJwt from '@/lib/motor-admin/authentication';
import MotorAdminResponse from '@/lib/motor-admin/response';

type MotorAdminHandler = (
    req: NextRequest, 
    data: { body: any; authentication: any }
) => Promise<Response>;

export const motorAdminRoute = (handler: MotorAdminHandler) => {
    return async (req: NextRequest): Promise<Response> => {
        const authHeader = req.headers.get('Authorization');
        const { error, authentication } = await verifyMotoradminJwt(authHeader);

        if (error) return MotorAdminResponse(401, { error });

        let body = {};
        try {
            const text = await req.text();
            body = text ? JSON.parse(text) : {};
        } catch (e) {
            body = {};
        }

        return handler(req, { body, authentication });
    };
};