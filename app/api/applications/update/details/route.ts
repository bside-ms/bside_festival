import prismaClient from '@/lib/common/prismaClient';
import type { Participant } from '@prisma/client';
import { NextResponse } from 'next/server';

export interface UpdateDetailsRequest {
    id: number;
    name: string;
    description: string;
}

export interface SuccessfulUpdateDetailsResponse {
    updatedParticipant: Participant;
}

export interface ErroneousUpdateDetailsResponse {
    message: string;
}

export const POST = async (request: Request): Promise<NextResponse<SuccessfulUpdateDetailsResponse | ErroneousUpdateDetailsResponse>> => {
    const { id, name, description } = (await request.json()) as UpdateDetailsRequest;

    const updatedParticipant = await prismaClient.participant.update({
        data: {
            updatedName: name,
            updatedDescription: description,
        },
        where: {
            id,
        },
    });

    const successfulResponse: SuccessfulUpdateDetailsResponse = {
        updatedParticipant,
    };

    return NextResponse.json(successfulResponse);
};
