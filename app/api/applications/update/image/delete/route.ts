import type { Participant } from '@prisma/client';
import prismaClient from 'lib/common/prismaClient';
import { NextResponse } from 'next/server';

export interface DeleteImageRequest {
    id: number;
}

export interface SuccessfulDeleteImageResponse {
    updatedParticipant: Participant;
}

export interface ErroneousDeleteImageResponse {
    message: string;
}

export const POST = async (request: Request): Promise<NextResponse<SuccessfulDeleteImageResponse | ErroneousDeleteImageResponse>> => {
    const { id } = (await request.json()) as DeleteImageRequest;

    const updatedParticipant = await prismaClient.participant.update({
        data: {
            imageFileName: null,
        },
        where: {
            id,
        },
    });

    const successfulResponse: SuccessfulDeleteImageResponse = {
        updatedParticipant,
    };

    return NextResponse.json(successfulResponse);
};
