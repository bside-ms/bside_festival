import verifyMotoradminJwt, { MotorAdminToken } from '@/lib/motor-admin/authentication';
import MotorAdminResponse from '@/lib/motor-admin/response';
import { NextRequest } from 'next/server';

type MotorAdminHandler<TBody extends Record<string, unknown> = Record<string, unknown>> = (
    req: NextRequest,
    data: {
        body: TBody;
        authentication: MotorAdminToken;
    },
) => Promise<Response>;

export const motorAdminRoute = <TBody extends Record<string, unknown>>(handler: MotorAdminHandler<TBody>) => {
    return async (req: NextRequest): Promise<Response> => {
        const authHeader = req.headers.get('Authorization');
        // const authentication = {}
        const { error, authentication } = await verifyMotoradminJwt(authHeader);
        if (error) {
            return MotorAdminResponse(401, { error });
        }

        let body: TBody;
        try {
            const text = await req.text();
            body = text ? JSON.parse(text) : {};
        } catch {
            body = {} as TBody;
        }

        return handler(req, {
            body,
            authentication: authentication as MotorAdminToken,
        });
    };
};
