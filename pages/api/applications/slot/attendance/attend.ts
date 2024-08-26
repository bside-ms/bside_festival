import { NextApiRequest, NextApiResponse } from 'next';
import prismaClient from 'lib/common/prismaClient';
import isGroupMember from 'lib/next-auth/isGroupMember';
import { getServerSession } from 'next-auth';
import authOptions from 'lib/next-auth/authOptions';
import AllAttendees from 'typings/AllAttendees';
import getAllAttendees from 'lib/participants/getAllAttendees';
import { dataPrivacyGroup } from 'lib/next-auth/KeycloakGroups';
import prisma from 'lib/common/prismaClient';
import sendSlotAttendConfirmationMail from 'lib/mail/sendSlotAttendConfirmationMail';

export interface AttendSlotRequest {
    slotId: number;
    fullName: string;
    mailAddress: string;
}

export interface SuccessfulAttendSlotResponse {
    allAttendees: Array<AllAttendees>;
}

export interface ErroneousAttendSlotResponse {
    errorCode: number;
}

export default async (
    request: NextApiRequest,
    response: NextApiResponse<SuccessfulAttendSlotResponse | ErroneousAttendSlotResponse>,
): Promise<void> => {
    const session = await getServerSession(request, response, authOptions);

    const { slotId, fullName, mailAddress } = request.body as AttendSlotRequest;

    const existingAttendee = await prismaClient.attendee.findFirst({ where: { slotId, fullName, mailAddress } });

    if (existingAttendee !== null) {
        response.status(200).json({ errorCode: 1721561870451 });
        return;
    }

    await prismaClient.attendee.create({
        data: {
            slotId,
            fullName,
            mailAddress,
            attendedAt: new Date(),
        },
    });

    const isInDataPrivacyGroup = isGroupMember(dataPrivacyGroup, session);

    const allAttendees = await getAllAttendees(session !== null && session.user !== undefined, isInDataPrivacyGroup);

    const slot = await prisma.slot.findUnique({ where: { id: slotId } });
    const participant = await prisma.participant.findUnique({ where: { id: slot?.participantId } });
    const location = await prisma.location.findUnique({ where: { id: slot?.locationId } });

    if (slot !== null && participant !== null && location !== null) {
        sendSlotAttendConfirmationMail(participant, slot, location, fullName, mailAddress);
    }

    response.status(200).json({ allAttendees });
};
