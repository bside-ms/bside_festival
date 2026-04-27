import { NextRequest } from "next/server"
import verifyMotoradminJwt from '@/lib/motor-admin/authentication';
import MotorAdminResponse from '@/lib/motor-admin/response';
import { motorAdminRoute } from '@/lib/motor-admin/route';

export const POST = motorAdminRoute(async (req, { body, authentication }) => {
    console.log("Payload:", body);

    const responseData = {
        status: 'success'
    };

    return MotorAdminResponse(200, responseData);
});


// async (req: NextRequest): Promise<Response> => {
//     const { error, au } = await verifyMotoradminJwt(req.headers.get('Authorization'));
//     if (error) return MotorAdminResponse(401, error);

//     console.log(req.body);
//     const reqData = req.body ? await req.json() : {};

//     const responseData = {
//         status: 'success', 
//         message: 'Greetings from Next.js API route!', 
//     };

//     return MotorAdminResponse(200, responseData);
// };
