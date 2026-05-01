import MotorAdminResponse from '@/lib/motor-admin/response';
import { motorAdminRoute } from '@/lib/motor-admin/route';

export const POST = motorAdminRoute(async (req, { body }) => {
    console.log('Payload:', body);

    return MotorAdminResponse(200, {
        status: 'success',
        message: 'Greetings from Next.js API route!',
    });
});
