import prismaClient from '@/lib/common/prismaClient';
import sendSlotAttendConfirmationMail from '@/lib/mail/sendSlotAttendConfirmationMail';
import getAllAttendees from '@/lib/participants/getAllAttendees';
import AllAttendees from '@/typings/AllAttendees';
import { NextResponse } from 'next/server';

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

export const POST = async (request: Request): Promise<NextResponse<SuccessfulAttendSlotResponse | ErroneousAttendSlotResponse>> => {
    const { slotId, fullName, mailAddress } = (await request.json()) as AttendSlotRequest;

    const existingAttendee = await prismaClient.attendee.findFirst({ where: { slotId, fullName, mailAddress } });

    if (existingAttendee !== null) {
        return NextResponse.json({ errorCode: 1721561870451 });
    }

    await prismaClient.attendee.create({
        data: {
            slotId,
            fullName,
            mailAddress,
            attendedAt: new Date(),
        },
    });

    const allAttendees = await getAllAttendees();

    const slot = await prismaClient.slot.findUnique({ where: { id: slotId } });
    const participant = await prismaClient.participant.findUnique({ where: { id: slot?.participantId } });
    const location = await prismaClient.location.findUnique({ where: { id: slot?.locationId } });

    if (slot !== null && participant !== null && location !== null) {
        sendSlotAttendConfirmationMail(participant, slot, location, fullName, mailAddress);
    }

    return NextResponse.json({ allAttendees });
};
