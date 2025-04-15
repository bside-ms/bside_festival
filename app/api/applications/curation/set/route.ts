import type { ApplicationStatus, Label, Participant, ParticipantLabel } from '@prisma/client';
import prismaClient from 'lib/common/prismaClient';
import { NextResponse } from 'next/server';

export interface SetCurationRequest {
    id: number;
    curationScore: number | null;
    curationInfo: string | null;
    applicationStatus: ApplicationStatus;
    labels: Array<string | number>;
}

export interface SuccessfulSetCurationResponse {
    updatedParticipant: Participant;
    allLabels: Array<Label>;
    participantLabels: Array<ParticipantLabel>;
}

export interface ErroneousSetCurationResponse {
    message: string;
}

export const POST = async (request: Request): Promise<NextResponse<SuccessfulSetCurationResponse | ErroneousSetCurationResponse>> => {
    const { id, curationScore, curationInfo, applicationStatus, labels } = (await request.json()) as SetCurationRequest;

    await prismaClient.participantLabel.deleteMany({
        where: {
            participantId: id,
        },
    });

    const updatedParticipant = await prismaClient.participant.update({
        data: {
            curationScore,
            curationInfo,
            status: applicationStatus,
            labels: {
                create: [
                    ...labels
                        .filter((label): label is number => typeof label === 'number')
                        .map((label) => ({
                            label: {
                                connect: {
                                    id: label,
                                },
                            },
                        })),
                    ...labels
                        .filter((label): label is string => typeof label === 'string')
                        .map((label) => ({
                            label: {
                                create: {
                                    label,
                                },
                            },
                        })),
                ],
            },
        },
        where: {
            id,
        },
    });

    const allLabels = await prismaClient.label.findMany();

    const participantLabels = await prismaClient.participantLabel.findMany();

    return NextResponse.json({ updatedParticipant, allLabels, participantLabels });
};
