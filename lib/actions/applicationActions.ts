'use server';

import isNotEmptyString from '@/lib/common/helper/isNotEmptyString';
import prismaClient from '@/lib/common/prismaClient';
import sendApplicationConfirmationMail from '@/lib/mail/sendApplicationConfirmationMail';
import allowedImageContentTypes from '@/lib/upload/allowedImageContentTypes';
import allowedImageMaxFileSize from '@/lib/upload/allowedImageMaxFileSize';
import allowedTechnicRiderContentType from '@/lib/upload/allowedTechnicRiderContentType';
import allowedTechnicalRiderMaxFileSize from '@/lib/upload/allowedTechnicalRiderMaxFileSize';
import uploadFileToIonos from '@/lib/upload/uploadFileToIonos';
import { Type, type ApplicationStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export interface AddParticipantData {
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

export const addApplication = async ({
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
}: AddParticipantData): Promise<void> => {
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
            genres: {
                create: [
                    ...concertGenres
                        .filter((genre): genre is number => typeof genre === 'number')
                        .map((id) => ({ genre: { connect: { id } } })),
                    ...concertGenres
                        .filter((genre): genre is string => typeof genre === 'string')
                        .map((genre) => ({ genre: { create: { type: Type.Concert, name: genre } } })),
                    ...diskJockeyGenres
                        .filter((genre): genre is number => typeof genre === 'number')
                        .map((id) => ({ genre: { connect: { id } } })),
                    ...diskJockeyGenres
                        .filter((genre): genre is string => typeof genre === 'string')
                        .map((genre) => ({ genre: { create: { type: Type.DiskJockey, name: genre } } })),
                ],
            },
            appliedAt: new Date(),
        },
    });

    for (const link of links) {
        await prismaClient.link.create({ data: { link, participantId: newParticipant.id } });
    }

    if (isNotEmptyString(newParticipant.contactMail)) {
        sendApplicationConfirmationMail({ ...newParticipant, contactMail: newParticipant.contactMail }, links);
    }

    revalidatePath('/bewerbungen/uebersicht');
};

export const updateApplicationDetails = async (id: number, name: string, description: string): Promise<void> => {
    await prismaClient.participant.update({ data: { updatedName: name, updatedDescription: description }, where: { id } });
    revalidatePath('/bewerbungen/uebersicht');
    revalidatePath('/programm');
};

export const deleteApplicationImage = async (id: number): Promise<void> => {
    await prismaClient.participant.update({ data: { imageFileName: null }, where: { id } });
    revalidatePath('/bewerbungen/uebersicht');
    revalidatePath('/programm');
};

export const replaceApplicationImage = async (id: number, encodedImage: string): Promise<void> => {
    const imageFileName = await uploadFileToIonos(encodedImage, allowedImageContentTypes, allowedImageMaxFileSize);
    await prismaClient.participant.update({ data: { imageFileName }, where: { id } });
    revalidatePath('/bewerbungen/uebersicht');
    revalidatePath('/programm');
};

export const setCuration = async (id: number, applicationStatus: ApplicationStatus): Promise<void> => {
    await prismaClient.participantLabel.deleteMany({ where: { participantId: id } });
    await prismaClient.participant.update({ data: { status: applicationStatus }, where: { id } });
    revalidatePath('/bewerbungen/uebersicht');
    revalidatePath('/programm');
};
