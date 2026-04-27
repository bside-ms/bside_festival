import { NextRequest } from "next/server"
import verifyMotoradminJwt from '@/lib/motor-admin/authentication';
import MotorAdminResponse from '@/lib/motor-admin/response';

export const POST = async (req: NextRequest): Promise<Response> => {
    const { error, decoded } = await verifyMotoradminJwt(req.headers.get('Authorization'));
    if (error) return MotorAdminResponse(401, error);

    console.log('Decoded JWT:', decoded);

    return MotorAdminResponse(200, { 
        status: 'success', 
        message: 'Greetings from Next.js API route!', 
    })
};

export const GET = async (): Promise<Response> => {
    return MotorAdminResponse(200, { 
        status: 'success', 
        message: 'Greetings from Next.js API route!' 
    })
};
