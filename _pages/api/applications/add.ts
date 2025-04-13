import type { Participant, Type } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { allowedImageContentTypes, allowedImageMaxFileSize } from 'components/applications/applicationForm/ImageUpload';
import {
    allowedTechnicalRiderMaxFileSize,
    allowedTechnicRiderContentType,
} from 'components/applications/applicationForm/TechnicalRiderFields';
import isNotEmptyString from 'lib/common/helper/isNotEmptyString';
import prismaClient from 'lib/common/prismaClient';
import sendApplicationConfirmationMail from 'lib/mail/sendApplicationConfirmationMail';
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
    technicalRider: string | null;
    encodedTechnicalRiderPdf: string | null;
    backlineSharing: string | null;
    materialExpenses: string | null;
    residence: string | null;
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
    response: NextApiResponse<SuccessfulAddParticipantResponse | ErroneousAddParticipantResponse>,
): Promise<void> => {
    const {
        type,
        motivation,
        encodedImage,
        name,
        description,
        residence,
        additionalInfo,
        contactPhone,
        encodedTechnicalRiderPdf,
        technicalRider,
        backlineSharing,
        materialExpenses,
        contactName,
        links,
        contactMail,
    } = request.body as AddParticipantRequest;

    const imageFileName = await uploadFileToIonos(encodedImage, allowedImageContentTypes, allowedImageMaxFileSize);

    const technicalRiderFileName = await uploadFileToIonos(
        encodedTechnicalRiderPdf,
        [allowedTechnicRiderContentType],
        allowedTechnicalRiderMaxFileSize,
    );

    const newParticipant = await prismaClient.participant.create({
        data: {
            type,
            name,
            contactName,
            contactPhone,
            contactMail,
            technicalRider,
            description,
            motivation,
            residence,
            additionalInfo,
            imageFileName,
            technicalRiderFileName,
            backlineSharing,
            materialExpenses,
            appliedAt: new Date(),
        },
    });

    for (const link of links) {
        await prismaClient.link.create({
            data: {
                link,
                participantId: newParticipant.id,
            },
        });
    }

    if (isNotEmptyString(newParticipant.contactMail)) {
        sendApplicationConfirmationMail(
            {
                ...newParticipant,
                contactMail: newParticipant.contactMail,
            },
            links,
        );
    }

    response.status(200).json({ newParticipant });
};
