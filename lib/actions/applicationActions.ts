'use server';

import { ApplicationFormValues } from '@/components/applications/applicationForm/ApplicationForm';
import prismaClient from '@/lib/common/prismaClient';
import allowedImageContentTypes from '@/lib/upload/allowedImageContentTypes';
import allowedImageMaxFileSize from '@/lib/upload/allowedImageMaxFileSize';
import allowedTechnicRiderContentType from '@/lib/upload/allowedTechnicRiderContentType';
import allowedTechnicalRiderMaxFileSize from '@/lib/upload/allowedTechnicalRiderMaxFileSize';
import uploadFileToIonos from '@/lib/upload/uploadFileToIonos';
import { createVerification } from '@/lib/actions/emailConfirmationActions';
import { Type, type ApplicationStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function addApplication(values: ApplicationFormValues, chosenType: Type) {
    try {
        const imageFileName = await uploadFileToIonos(values.encodedImage, allowedImageContentTypes, allowedImageMaxFileSize);

        const technicalRiderFileName = values.encodedTechnicalRiderPdf
            ? await uploadFileToIonos(values.encodedTechnicalRiderPdf, [allowedTechnicRiderContentType], allowedTechnicalRiderMaxFileSize)
            : null;

        const publicLinks = values.publicLinks.map((l) => l.url).filter((url) => url.trim() !== '');
        const privateLinks = values.privateLinks.map((l) => l.url).filter((url) => url.trim() !== '');

        const newParticipant = await prismaClient.participant.create({
            data: {
                type: chosenType,
                name: values.name,
                contactName: values.contactName,
                contactPhone: values.contactPhone,
                contactMail: values.contactMail,
                technicalRider: values.technicalRider ?? null,
                description: values.description,
                motivation: values.motivation,
                residence: values.residence ?? null,
                additionalInfo: values.additionalInfo,
                imageFileName,
                technicalRiderFileName,
                backlineSharing: values.backlineSharing ?? null,
                participantCount: values.participantCount,
                flintaParticipantsCount: values.flintaParticipantsCount,
                hasMarginalizedParticipants: values.hasMarginalizedParticipants,
                professionalParticipantsCount: values.professionalParticipantsCount,
                diversityNotes: values.diversityNotes,
                allergies: values.allergies,

                genres: {
                    create: [
                        ...(values.concertGenres ?? []).map((genre) =>
                            typeof genre === 'number'
                                ? { genre: { connect: { id: genre } } }
                                : { genre: { create: { type: Type.Concert, name: genre } } },
                        ),
                        ...(values.diskJockeyGenres ?? []).map((genre) =>
                            typeof genre === 'number'
                                ? { genre: { connect: { id: genre } } }
                                : { genre: { create: { type: Type.DiskJockey, name: genre } } },
                        ),
                    ],
                },
                zipcodes: {
                    create: [
                        ...(values.participantZipcodes ?? []).map((pz) => (
                            { code: pz.code, isInternational: pz.isInternational }
                        )),
                    ],
                },
                links: {
                    create: [
                        ...publicLinks.map((link) => ({ link, isConfidential: false })),
                        ...privateLinks.map((link) => ({ link, isConfidential: true })),
                    ],
                },
                appliedAt: new Date(),
            },
        });
        createVerification(newParticipant);

        return {
            id: newParticipant.id
        };
    } catch (error) {
        console.error('Submission Error:', error);
        // We throw or return an error object to be caught by the Client Component
        return {
            id: null,
            message: error instanceof Error ? error.message : 'An unexpected error occurred.',
        };
    }
}

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
