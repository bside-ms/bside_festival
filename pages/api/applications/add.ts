import type { Participant, Type } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import prismaClient from 'lib/common/prismaClient';
import uploadFileToIonos from 'lib/upload/uploadFileToIonos';

export interface AddParticipantRequest {
    type: Type;
    name: string;
    contactName: string;
    contactPhone: string;
    contactMail: string;
    description: string;
    encodedImage: string;
    motivation: string;
    additionalInfo: string;
    technicalRider: string;
    encodedTechnicalRiderPdf: string;
    residence: string;
    links: Array<string>;
}

interface ErroneousAddParticipantResponse {
    message: string;
}

export interface SuccessfulAddParticipantResponse {
    newParticipant: Participant;
}

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '50mb',
        },
    },
};

export default async (
    request: NextApiRequest,
    response: NextApiResponse<SuccessfulAddParticipantResponse | ErroneousAddParticipantResponse>
): Promise<void> => {

    const requestBody = request.body as AddParticipantRequest;

    const imageFileName = await uploadFileToIonos(requestBody.encodedImage);
    const technicalRiderFileName = await uploadFileToIonos(requestBody.encodedTechnicalRiderPdf);

    const dataCool = {
        type: requestBody.type,
        name: requestBody.name,
        contactName: requestBody.contactName,
        contactPhone: requestBody.contactPhone,
        contactMail: requestBody.contactMail,
        technicalRider: requestBody.technicalRider,
        description: requestBody.description,
        motivation: requestBody.motivation,
        residence: requestBody.residence,
        imageFileName,
        technicalRiderFileName,
        appliedAt: new Date(),
    };

    console.log('dataCool', dataCool);
    const newParticipant = await prismaClient.participant.create({
        data: dataCool,
    });

    for (const link of requestBody.links) {
        await prismaClient.link.create({
            data: {
                link,
                participantId: newParticipant.id,
            },
        });
    }

    response.status(200).json({ newParticipant });
};
