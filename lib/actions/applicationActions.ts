'use server';

import { ApplicationFormValues } from '@/components/applications/applicationForm/ApplicationForm';
import { createVerification } from '@/lib/actions/emailConfirmationActions';
import prismaClient from '@/lib/common/prismaClient';
import {
    createUpdateApplicationBookingInfoSchema,
    createUpdateApplicationDiversityInfoSchema,
    createUpdateApplicationParticipantCountSchema,
    updateApplicationAdditionalInfoSchema,
    updateApplicationContactInfoSchema,
    updateApplicationDescriptionSchema,
    updateApplicationDurationPreferenceSchema,
    updateApplicationMotivationSchema,
    updateApplicationNameSchema,
    updateApplicationParticipantCountSchema,
} from '@/lib/schemas/applicationSchema';
import allowedImageContentTypes from '@/lib/upload/allowedImageContentTypes';
import allowedImageMaxFileSize from '@/lib/upload/allowedImageMaxFileSize';
import allowedTechnicRiderContentType from '@/lib/upload/allowedTechnicRiderContentType';
import allowedTechnicalRiderMaxFileSize from '@/lib/upload/allowedTechnicalRiderMaxFileSize';
import uploadFileToIonos from '@/lib/upload/uploadFileToIonos';
import { Type, type ApplicationStatus } from '@prisma/client';
import { max } from 'lodash';
import { revalidatePath } from 'next/cache';
import type { z } from 'zod';

const normalizeOptionalText = (value: string | undefined): string | null => {
    if (value === undefined || value.trim().length === 0) {
        return null;
    }

    return value;
};

export async function addApplication(values: ApplicationFormValues, chosenType: Type) {
    try {
        const imageFileName = await uploadFileToIonos(values.encodedImage, allowedImageContentTypes, allowedImageMaxFileSize);

        const technicalRiderFileName = values.encodedTechnicalRiderPdf
            ? await uploadFileToIonos(values.encodedTechnicalRiderPdf, [allowedTechnicRiderContentType], allowedTechnicalRiderMaxFileSize)
            : null;

        const publicLinks = values.publicLinks.map((l) => l.url).filter((url) => url.trim() !== '');
        const privateLinks = values.privateLinks.map((l) => l.url).filter((url) => url.trim() !== '');
        const professionalParticipantsCount = values.isProfessionalBooking ? values.participantCount : values.professionalParticipantsCount;

        const newParticipant = await prismaClient.participant.create({
            data: {
                type: chosenType,
                name: values.name,
                contactName: values.contactName,
                contactPhone: values.contactPhone,
                contactMail: values.contactMail,
                technicalRider: values.technicalRider ?? null,
                description: values.description,
                durationPreference: values.durationPreference ?? null,
                motivation: values.motivation,
                additionalInfo: values.additionalInfo,
                imageFileName,
                technicalRiderFileName,
                backlineSharing: values.backlineSharing ?? null,
                participantCount: values.participantCount,
                flintaParticipantsCount: values.flintaParticipantsCount,
                hasMarginalizedParticipants: values.hasMarginalizedParticipants,
                isProfessionalBooking: values.isProfessionalBooking,
                professionalParticipantsCount,
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
                    create: [...(values.participantZipcodes ?? []).map((pz) => ({ code: pz.code, isInternational: pz.isInternational }))],
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
            id: newParticipant.id,
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
    const parsedName = updateApplicationNameSchema.parse({ name }).name;
    const parsedDescription = updateApplicationDescriptionSchema.parse({ description }).description;

    await prismaClient.participant.update({ data: { description: parsedDescription, name: parsedName }, where: { id } });
    revalidatePath('/bewerbungen/uebersicht');
    revalidatePath('/programm');
};

export const updateApplicationName = async (id: number, values: z.infer<typeof updateApplicationNameSchema>): Promise<void> => {
    const { name } = updateApplicationNameSchema.parse(values);

    await prismaClient.participant.update({ data: { name }, where: { id } });
    revalidatePath('/bewerbungen/uebersicht');
    revalidatePath('/programm');
};

export const updateApplicationDescription = async (
    id: number,
    values: z.infer<typeof updateApplicationDescriptionSchema>,
): Promise<void> => {
    const { description } = updateApplicationDescriptionSchema.parse(values);

    await prismaClient.participant.update({ data: { description }, where: { id } });
    revalidatePath('/bewerbungen/uebersicht');
    revalidatePath('/programm');
};

export const updateApplicationMotivation = async (id: number, values: z.infer<typeof updateApplicationMotivationSchema>): Promise<void> => {
    const { motivation } = updateApplicationMotivationSchema.parse(values);

    await prismaClient.participant.update({ data: { motivation: normalizeOptionalText(motivation) }, where: { id } });
    revalidatePath('/bewerbungen/uebersicht');
};

export const updateApplicationParticipantCount = async (
    id: number,
    values: z.infer<typeof updateApplicationParticipantCountSchema>,
): Promise<void> => {
    const currentApplication = await prismaClient.participant.findUniqueOrThrow({
        select: { flintaParticipantsCount: true, professionalParticipantsCount: true },
        where: { id },
    });
    const minimumParticipantCount =
        max([1, currentApplication.flintaParticipantsCount, currentApplication.professionalParticipantsCount]) ?? 1;
    const { participantCount } = createUpdateApplicationParticipantCountSchema(minimumParticipantCount).parse(values);

    await prismaClient.participant.update({ data: { participantCount }, where: { id } });
    revalidatePath('/bewerbungen/uebersicht');
};

export const updateApplicationDurationPreference = async (
    id: number,
    values: z.infer<typeof updateApplicationDurationPreferenceSchema>,
): Promise<void> => {
    const { durationPreference } = updateApplicationDurationPreferenceSchema.parse(values);

    await prismaClient.participant.update({ data: { durationPreference }, where: { id } });
    revalidatePath('/bewerbungen/uebersicht');
};

export const updateApplicationBookingInfo = async (
    id: number,
    values: z.infer<ReturnType<typeof createUpdateApplicationBookingInfoSchema>>,
): Promise<void> => {
    const { participantCount } = await prismaClient.participant.findUniqueOrThrow({ select: { participantCount: true }, where: { id } });
    const { isProfessionalBooking, professionalParticipantsCount } =
        createUpdateApplicationBookingInfoSchema(participantCount).parse(values);

    await prismaClient.participant.update({
        data: {
            isProfessionalBooking: isProfessionalBooking ?? false,
            professionalParticipantsCount: isProfessionalBooking ? participantCount : (professionalParticipantsCount ?? 0),
        },
        where: { id },
    });
    revalidatePath('/bewerbungen/uebersicht');
};

export const updateApplicationDiversityInfo = async (
    id: number,
    values: z.infer<ReturnType<typeof createUpdateApplicationDiversityInfoSchema>>,
): Promise<void> => {
    const { participantCount } = await prismaClient.participant.findUniqueOrThrow({ select: { participantCount: true }, where: { id } });
    const { flintaParticipantsCount, hasMarginalizedParticipants, diversityNotes } =
        createUpdateApplicationDiversityInfoSchema(participantCount).parse(values);

    await prismaClient.participant.update({
        data: {
            flintaParticipantsCount,
            hasMarginalizedParticipants,
            diversityNotes: normalizeOptionalText(diversityNotes),
        },
        where: { id },
    });
    revalidatePath('/bewerbungen/uebersicht');
};

export const updateApplicationAdditionalInfo = async (
    id: number,
    values: z.infer<typeof updateApplicationAdditionalInfoSchema>,
): Promise<void> => {
    const { additionalInfo } = updateApplicationAdditionalInfoSchema.parse(values);

    await prismaClient.participant.update({ data: { additionalInfo: normalizeOptionalText(additionalInfo) }, where: { id } });
    revalidatePath('/bewerbungen/uebersicht');
    revalidatePath('/programm');
};

export const updateApplicationContactInfo = async (
    id: number,
    values: z.infer<typeof updateApplicationContactInfoSchema>,
): Promise<void> => {
    const { contactName, contactMail, contactPhone } = updateApplicationContactInfoSchema.parse(values);

    await prismaClient.participant.update({ data: { contactName, contactMail, contactPhone }, where: { id } });
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
