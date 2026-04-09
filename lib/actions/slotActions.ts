'use server';

import prismaClient from '@/lib/common/prismaClient';
import sendSlotAttendConfirmationMail from '@/lib/mail/sendSlotAttendConfirmationMail';
import { revalidatePath } from 'next/cache';

export interface AttendSlotError {
    errorCode: number;
}

export const updateSlot = async (
    participantId: number,
    locationId: number,
    begin: Date,
    duration: number,
    maxAttendees?: number,
): Promise<void> => {
    await prismaClient.slot.deleteMany({ where: { participantId } });
    await prismaClient.slot.create({ data: { participantId, locationId, begin, duration, maxAttendees } });
    revalidatePath('/bewerbungen/uebersicht');
    revalidatePath('/programm');
    revalidatePath('/programm/timetable');
};

export const deleteSlot = async (participantId: number): Promise<void> => {
    await prismaClient.slot.deleteMany({ where: { participantId } });
    revalidatePath('/bewerbungen/uebersicht');
    revalidatePath('/programm');
    revalidatePath('/programm/timetable');
};

export const attendSlot = async (slotId: number, fullName: string, mailAddress: string): Promise<AttendSlotError | null> => {
    const existingAttendee = await prismaClient.attendee.findFirst({ where: { slotId, fullName, mailAddress } });

    if (existingAttendee !== null) {
        return { errorCode: 1721561870451 };
    }

    await prismaClient.attendee.create({ data: { slotId, fullName, mailAddress, attendedAt: new Date() } });

    const slot = await prismaClient.slot.findUnique({ where: { id: slotId } });
    const participant = await prismaClient.participant.findUnique({ where: { id: slot?.participantId } });
    const location = await prismaClient.location.findUnique({ where: { id: slot?.locationId } });

    if (slot !== null && participant !== null && location !== null) {
        sendSlotAttendConfirmationMail(participant, slot, location, fullName, mailAddress);
    }

    revalidatePath('/programm');

    return null;
};
