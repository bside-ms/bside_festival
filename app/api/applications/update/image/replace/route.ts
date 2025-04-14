import type { Participant } from '@prisma/client';
import prismaClient from 'lib/common/prismaClient';
import uploadFileToIonos from 'lib/upload/uploadFileToIonos';
import { NextResponse } from 'next/server';
import allowedImageContentTypes from 'lib/upload/allowedImageContentTypes';
import allowedImageMaxFileSize from 'lib/upload/allowedImageMaxFileSize';

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

export const POST = async (request: Request): Promise<NextResponse<SuccessfulReplaceImageResponse | ErroneousReplaceImageResponse>> => {
    const { id, encodedImage } = (await request.json()) as ReplaceImageRequest;

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

    return NextResponse.json(successfulResponse);
};
