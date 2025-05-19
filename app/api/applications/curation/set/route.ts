import type { ApplicationStatus, Participant } from '@prisma/client';
import prismaClient from 'lib/common/prismaClient';
import { NextResponse } from 'next/server';

export interface SetCurationRequest {
    id: number;
    applicationStatus: ApplicationStatus;
}

export interface SuccessfulSetCurationResponse {
    updatedParticipant: Participant;
}

export interface ErroneousSetCurationResponse {
    message: string;
}

export const POST = async (request: Request): Promise<NextResponse<SuccessfulSetCurationResponse | ErroneousSetCurationResponse>> => {
    const { id, applicationStatus } = (await request.json()) as SetCurationRequest;

    await prismaClient.participantLabel.deleteMany({ where: { participantId: id } });

    const updatedParticipant = await prismaClient.participant.update({
        data: { status: applicationStatus },
        where: { id },
    });

    return NextResponse.json({ updatedParticipant });
};
