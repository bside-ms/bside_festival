import type { Participant } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import prismaClient from 'lib/common/prismaClient';
import uploadFileToIonos from 'lib/upload/uploadFileToIonos';
import { allowedImageContentTypes, allowedImageMaxFileSize } from 'components/applications/applicationForm/ImageUpload';

export interface ReplaceImageRequest {
    id: number;
    encodedImage: string;
}

export interface SuccessfulReplaceImageResponse {
    updatedParticipant: Participant;
}

export interface ErroneousReplaceImageResponse {
    message: string;
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
    response: NextApiResponse<SuccessfulReplaceImageResponse | ErroneousReplaceImageResponse>,
): Promise<void> => {
    const { id, encodedImage } = request.body as ReplaceImageRequest;

    const imageFileName = await uploadFileToIonos(encodedImage, allowedImageContentTypes, allowedImageMaxFileSize);

    const updatedParticipant = await prismaClient.participant.update({
        data: {
            imageFileName,
        },
        where: {
            id,
        },
    });

    const successfulResponse: SuccessfulReplaceImageResponse = {
        updatedParticipant,
    };

    response.status(200).json(successfulResponse);
};
