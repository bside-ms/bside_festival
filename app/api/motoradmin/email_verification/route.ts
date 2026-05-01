import { createVerification } from '@/lib/actions/emailConfirmationActions';
import prismaClient from '@/lib/common/prismaClient';
import MotorAdminResponse from '@/lib/motor-admin/response';
import { motorAdminRoute } from '@/lib/motor-admin/route';

export const POST = motorAdminRoute(async (req, { body }) => {
    console.log('Payload:', body);

    const participantId = Number(body.id);

    if (isNaN(participantId)) {
        return MotorAdminResponse(400, { error: 'Invalid ID format' });
    }

    const participant = await prismaClient.participant.findUnique({
        where: { id: participantId },
    });
    if (!participant) {
        throw new Error('Teilnehmer nicht gefunden.');
    }

    createVerification(participant);

    const responseData = {
        message: 'Resent Verification Email',
    };

    return MotorAdminResponse(200, responseData);
});
