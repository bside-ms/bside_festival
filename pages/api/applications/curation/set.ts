import type { ApplicationStatus, Label, Participant, ParticipantLabel } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import prismaClient from 'lib/common/prismaClient';

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

export default async (
    request: NextApiRequest,
    response: NextApiResponse<SuccessfulSetCurationResponse | ErroneousSetCurationResponse>
): Promise<void> => {

    const {
        id,
        curationScore,
        curationInfo,
        applicationStatus,
        labels,
    } = request.body as SetCurationRequest;

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
                        .map(label => ({
                            label: {
                                connect: {
                                    id: label,
                                },
                            },
                        })),
                    ...labels
                        .filter((label): label is string => typeof label === 'string')
                        .map(label => ({
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

    response.status(200).json({ updatedParticipant, allLabels, participantLabels });
};
