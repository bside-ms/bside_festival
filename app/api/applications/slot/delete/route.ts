import prismaClient from '@/lib/common/prismaClient';
import getAllSlots from '@/lib/participants/getAllSlots';
import { SerializableSlot } from '@/typings/SerializableSlot';
import { NextResponse } from 'next/server';

export interface DeleteSlotRequest {
    participantId: number;
}

export interface SuccessfulDeleteSlotResponse {
    updatedSlots: Array<SerializableSlot>;
}

export interface ErroneousDeleteSlotResponse {
    message: string;
}

export const POST = async (request: Request): Promise<NextResponse<SuccessfulDeleteSlotResponse | ErroneousDeleteSlotResponse>> => {
    const { participantId } = (await request.json()) as DeleteSlotRequest;

    await prismaClient.slot.deleteMany({ where: { participantId } });

    const updatedSlots = await getAllSlots();

    return NextResponse.json({ updatedSlots });
};
