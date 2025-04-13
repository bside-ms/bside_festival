import { NextResponse } from 'next/server';
import prismaClient from 'lib/common/prismaClient';
import getAllSlots from 'lib/participants/getAllSlots';
import type { SerializableSlot } from 'typings/SerializableSlot';

export interface UpsertSlotRequest {
    participantId: number;
    locationId: number;
    begin: Date;
    duration: number;
    maxAttendees?: number;
}

export interface SuccessfulUpdateSlotResponse {
    updatedSlots: Array<SerializableSlot>;
}

export interface ErroneousUpdateSlotResponse {
    message: string;
}

export const POST = async (request: Request): Promise<NextResponse<SuccessfulUpdateSlotResponse>> => {
    const { participantId, locationId, begin, duration, maxAttendees } = (await request.json()) as UpsertSlotRequest;

    // Just deleting slot before creating new one, since upsert only works with unique fields.
    await prismaClient.slot.deleteMany({ where: { participantId } });

    await prismaClient.slot.create({
        data: {
            participantId,
            locationId,
            begin,
            duration,
            maxAttendees,
        },
    });

    const updatedSlots = await getAllSlots();

    return NextResponse.json({ updatedSlots });
};
