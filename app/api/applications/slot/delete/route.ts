import { NextResponse } from 'next/server';
import prismaClient from 'lib/common/prismaClient';
import { Slot } from '@prisma/client';
import getAllSlots from 'lib/participants/getAllSlots';

export interface DeleteSlotRequest {
    participantId: number;
}

export interface SuccessfulDeleteSlotResponse {
    updatedSlots: Array<Slot>;
}

export interface ErroneousDeleteSlotResponse {
    message: string;
}

export async function POST(request: Request): Promise<NextResponse<SuccessfulDeleteSlotResponse | ErroneousDeleteSlotResponse>> {
    const { participantId } = (await request.json()) as DeleteSlotRequest;

    await prismaClient.slot.deleteMany({ where: { participantId } });

    const updatedSlots = await getAllSlots();

    return NextResponse.json({ updatedSlots });
}
