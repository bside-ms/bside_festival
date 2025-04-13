import { NextResponse } from 'next/server';
import prismaClient from 'lib/common/prismaClient';
import { Slot } from '@prisma/client';
import getAllSlots from 'lib/participants/getAllSlots';

export interface UpsertSlotRequest {
    participantId: number;
    locationId: number;
    begin: Date;
    duration: number;
    maxAttendees?: number;
}

export interface SuccessfulUpdateSlotResponse {
    updatedSlots: Array<Slot>;
}

export async function POST(request: Request): Promise<NextResponse<SuccessfulUpdateSlotResponse>> {
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
}
