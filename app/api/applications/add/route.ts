import type { Participant, Type } from '@prisma/client';
import { NextResponse } from 'next/server';
import prismaClient from 'lib/common/prismaClient';
import uploadFileToIonos from 'lib/upload/uploadFileToIonos';
import allowedImageContentTypes from 'lib/upload/allowedImageContentTypes';
import allowedImageMaxFileSize from 'lib/upload/allowedImageMaxFileSize';
import allowedTechnicRiderContentType from 'lib/upload/allowedTechnicRiderContentType';
import allowedTechnicalRiderMaxFileSize from 'lib/upload/allowedTechnicalRiderMaxFileSize';

export interface AddParticipantRequest {
    type: Type;
    name: string;
    contactName: string;
    contactPhone: string;
    contactMail: string;
    description: string;
    concertGenres: Array<string | number>;
    diskJockeyGenres: Array<string | number>;
    encodedImage: string;
    motivation: string;
    additionalInfo: string;
    technicalRider: string | null;
    encodedTechnicalRiderPdf: string | null;
    backlineSharing: string | null;
    materialExpenses: string | null;
    residence: string | null;
    participantCount: string;
    hasFlintaParticipants: boolean;
    hasMarginalizedParticipants: boolean;
    diversityNotes: string;
    allergies: string;
    links: Array<string>;
}

interface ErroneousAddParticipantResponse {
    message: string;
}

export interface SuccessfulAddParticipantResponse {
    newParticipant: Participant;
}

export const POST = async (request: Request): Promise<NextResponse<SuccessfulAddParticipantResponse | ErroneousAddParticipantResponse>> => {
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
        participantCount,
        hasFlintaParticipants,
        hasMarginalizedParticipants,
        diversityNotes,
        allergies,
        concertGenres,
        diskJockeyGenres,
    } = (await request.json()) as AddParticipantRequest;

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
            participantCount,
            hasFlintaParticipants,
            hasMarginalizedParticipants,
            diversityNotes,
            allergies,
            concertGenres: {
                create: [
                    ...concertGenres
                        .filter((genre): genre is number => typeof genre === 'number')
                        .map((id) => ({ genre: { connect: { id } } })),
                    ...concertGenres
                        .filter((genre): genre is string => typeof genre === 'string')
                        .map((genre) => ({ genre: { create: { genre } } })),
                ],
            },
            diskJockeyGenres: {
                create: [
                    ...diskJockeyGenres
                        .filter((genre): genre is number => typeof genre === 'number')
                        .map((id) => ({ genre: { connect: { id } } })),
                    ...diskJockeyGenres
                        .filter((genre): genre is string => typeof genre === 'string')
                        .map((genre) => ({ genre: { create: { genre } } })),
                ],
            },
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

    // TODO
    //  if (isNotEmptyString(newParticipant.contactMail)) {
    //      sendApplicationConfirmationMail(
    //          {
    //              ...newParticipant,
    //              contactMail: newParticipant.contactMail,
    //          },
    //          links,
    //      );
    //  }

    return NextResponse.json({ newParticipant });
};
