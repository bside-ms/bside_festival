import type { Participant } from '@prisma/client';
import prismaClient from 'lib/common/prismaClient';
import { NextResponse } from 'next/server';

export interface UpdateDescriptionRequest {
    id: number;
    description: string;
}

export interface SuccessfulUpdateDescriptionResponse {
    updatedParticipant: Participant;
}

export interface ErroneousUpdateDescriptionResponse {
    message: string;
}

export const POST = async (
    request: Request,
): Promise<NextResponse<SuccessfulUpdateDescriptionResponse | ErroneousUpdateDescriptionResponse>> => {
    const { id, description } = (await request.json()) as UpdateDescriptionRequest;

    const updatedParticipant = await prismaClient.participant.update({
        data: {
            updatedDescription: description,
        },
        where: {
            id,
        },
    });

    const successfulResponse: SuccessfulUpdateDescriptionResponse = {
        updatedParticipant,
    };

    return NextResponse.json(successfulResponse);
};
