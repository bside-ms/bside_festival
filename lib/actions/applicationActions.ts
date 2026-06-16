'use server';

import { ApplicationFormValues } from '@/components/applications/applicationForm/ApplicationForm';
import { requireDataPrivacyUser, requireLoggedInUser, type ActionUser } from '@/lib/actions/actionAuth';
import { createVerification } from '@/lib/actions/emailConfirmationActions';
import { parseJuryVotes } from '@/lib/applications/curationScoring';
import {
    formatApplicationStatus,
    formatBoolean,
    formatJuryVotes,
    formatNullableNumber,
    formatNullableText,
    formatOrganizers,
    formatPastParticipation,
    type OrganizerChangeLogSnapshot,
} from '@/lib/changeLog/changeLogLabels';
import type { ChangeLogChange } from '@/lib/changeLog/changeLogTypes';
import { createChange } from '@/lib/changeLog/createChange';
import { recordChangeLogEntry } from '@/lib/changeLog/recordChangeLogEntry';
import prismaClient from '@/lib/common/prismaClient';
import {
    createUpdateApplicationBookingInfoSchema,
    createUpdateApplicationDiversityInfoSchema,
    createUpdateApplicationParticipantCountSchema,
    updateApplicationAdditionalInfoSchema,
    updateApplicationContactInfoSchema,
    updateApplicationDescriptionSchema,
    updateApplicationDurationPreferenceSchema,
    updateApplicationJuryVotesSchema,
    updateApplicationMotivationSchema,
    updateApplicationNameSchema,
    updateApplicationParticipantCountSchema,
    updateApplicationPastParticipationSchema,
} from '@/lib/schemas/applicationSchema';
import allowedImageContentTypes from '@/lib/upload/allowedImageContentTypes';
import allowedImageMaxFileSize from '@/lib/upload/allowedImageMaxFileSize';
import allowedTechnicRiderContentType from '@/lib/upload/allowedTechnicRiderContentType';
import allowedTechnicalRiderMaxFileSize from '@/lib/upload/allowedTechnicalRiderMaxFileSize';
import uploadFileToIonos from '@/lib/upload/uploadFileToIonos';
import { ChangeLogAction, ChangeLogTargetType, Prisma, Type, type ApplicationStatus } from '@prisma/client';
import { max } from 'lodash';
import { revalidatePath } from 'next/cache';
import type { z } from 'zod';

const normalizeOptionalText = (value: string | undefined): string | null => {
    if (value === undefined || value.trim().length === 0) {
        return null;
    }

    return value;
};

const filterChanges = (changes: Array<ChangeLogChange | null>): Array<ChangeLogChange> =>
    changes.filter((change): change is ChangeLogChange => change !== null);

const revalidateApplicationPaths = (): void => {
    revalidatePath('/intern');
    revalidatePath('/intern/kuration');
    revalidatePath('/bewerbungen/uebersicht');
    revalidatePath('/bewerbungen/kuration');
    revalidatePath('/programm');
    revalidatePath('/aenderungslog');
};

const getActionUserId = (actor: ActionUser): string => actor.email ?? actor.name ?? 'unknown-user';

const getActionUserName = (actor: ActionUser): string => actor.name ?? actor.email ?? 'Unbekannt';

const recordApplicationChange = async (
    tx: Prisma.TransactionClient,
    actor: ActionUser,
    action: ChangeLogAction,
    application: { id: number; name: string },
    changes: Array<ChangeLogChange>,
): Promise<void> => {
    await recordChangeLogEntry(tx, actor, {
        action,
        target: { type: ChangeLogTargetType.Application, id: application.id, name: application.name },
        changes,
    });
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
                hasParticipatedBefore: values.hasParticipatedBefore ?? false,

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

export const updateApplicationName = async (id: number, values: z.infer<typeof updateApplicationNameSchema>): Promise<void> => {
    const actor = await requireLoggedInUser();
    const { name } = updateApplicationNameSchema.parse(values);

    await prismaClient.$transaction(async (tx) => {
        const application = await tx.participant.findUniqueOrThrow({ select: { id: true, name: true }, where: { id } });
        const changes = filterChanges([createChange('name', 'Name', application.name, name, formatNullableText)]);

        if (changes.length === 0) {
            return;
        }

        await tx.participant.update({ data: { name }, where: { id } });
        await recordApplicationChange(tx, actor, ChangeLogAction.ApplicationNameUpdated, { ...application, name }, changes);
    });
    revalidateApplicationPaths();
};

export const updateApplicationDescription = async (
    id: number,
    values: z.infer<typeof updateApplicationDescriptionSchema>,
): Promise<void> => {
    const actor = await requireLoggedInUser();
    const { description } = updateApplicationDescriptionSchema.parse(values);

    await prismaClient.$transaction(async (tx) => {
        const application = await tx.participant.findUniqueOrThrow({ select: { description: true, id: true, name: true }, where: { id } });
        const changes = filterChanges([
            createChange('description', 'Beschreibung', application.description, description, formatNullableText),
        ]);

        if (changes.length === 0) {
            return;
        }

        await tx.participant.update({ data: { description }, where: { id } });
        await recordApplicationChange(tx, actor, ChangeLogAction.ApplicationDescriptionUpdated, application, changes);
    });
    revalidateApplicationPaths();
};

export const updateApplicationMotivation = async (id: number, values: z.infer<typeof updateApplicationMotivationSchema>): Promise<void> => {
    const actor = await requireLoggedInUser();
    const { motivation } = updateApplicationMotivationSchema.parse(values);
    const normalizedMotivation = normalizeOptionalText(motivation);

    await prismaClient.$transaction(async (tx) => {
        const application = await tx.participant.findUniqueOrThrow({ select: { id: true, motivation: true, name: true }, where: { id } });
        const changes = filterChanges([
            createChange('motivation', 'Motivation', application.motivation, normalizedMotivation, formatNullableText),
        ]);

        if (changes.length === 0) {
            return;
        }

        await tx.participant.update({ data: { motivation: normalizedMotivation }, where: { id } });
        await recordApplicationChange(tx, actor, ChangeLogAction.ApplicationMotivationUpdated, application, changes);
    });
    revalidateApplicationPaths();
};

export const updateApplicationParticipantCount = async (
    id: number,
    values: z.infer<typeof updateApplicationParticipantCountSchema>,
): Promise<void> => {
    const actor = await requireLoggedInUser();
    const participantCounts = await prismaClient.participant.findUniqueOrThrow({
        select: { flintaParticipantsCount: true, professionalParticipantsCount: true },
        where: { id },
    });
    const minimumParticipantCount =
        max([1, participantCounts.flintaParticipantsCount, participantCounts.professionalParticipantsCount]) ?? 1;
    const { participantCount } = createUpdateApplicationParticipantCountSchema(minimumParticipantCount).parse(values);

    await prismaClient.$transaction(async (tx) => {
        const application = await tx.participant.findUniqueOrThrow({
            select: { id: true, name: true, participantCount: true },
            where: { id },
        });
        const changes = filterChanges([
            createChange('participantCount', 'Personenzahl', application.participantCount, participantCount, formatNullableNumber),
        ]);

        if (changes.length === 0) {
            return;
        }

        await tx.participant.update({ data: { participantCount }, where: { id } });
        await recordApplicationChange(tx, actor, ChangeLogAction.ApplicationParticipantCountUpdated, application, changes);
    });
    revalidateApplicationPaths();
};

export const updateApplicationDurationPreference = async (
    id: number,
    values: z.infer<typeof updateApplicationDurationPreferenceSchema>,
): Promise<void> => {
    const actor = await requireLoggedInUser();
    const { durationPreference } = updateApplicationDurationPreferenceSchema.parse(values);

    await prismaClient.$transaction(async (tx) => {
        const application = await tx.participant.findUniqueOrThrow({
            select: { durationPreference: true, id: true, name: true },
            where: { id },
        });
        const changes = filterChanges([
            createChange('durationPreference', 'Dauerwunsch', application.durationPreference, durationPreference, formatNullableText),
        ]);

        if (changes.length === 0) {
            return;
        }

        await tx.participant.update({ data: { durationPreference }, where: { id } });
        await recordApplicationChange(tx, actor, ChangeLogAction.ApplicationDurationPreferenceUpdated, application, changes);
    });
    revalidateApplicationPaths();
};

export const updateApplicationPastParticipation = async (
    id: number,
    values: z.infer<typeof updateApplicationPastParticipationSchema>,
): Promise<void> => {
    const actor = await requireLoggedInUser();
    const { hasParticipatedBefore } = updateApplicationPastParticipationSchema.parse(values);
    const nextHasParticipatedBefore = hasParticipatedBefore === 'unknown' ? null : hasParticipatedBefore === 'yes';

    await prismaClient.$transaction(async (tx) => {
        const application = await tx.participant.findUniqueOrThrow({
            select: { hasParticipatedBefore: true, id: true, name: true },
            where: { id },
        });
        const changes = filterChanges([
            createChange(
                'hasParticipatedBefore',
                'Frühere Teilnahme',
                application.hasParticipatedBefore,
                nextHasParticipatedBefore,
                formatPastParticipation,
            ),
        ]);

        if (changes.length === 0) {
            return;
        }

        await tx.participant.update({
            data: { hasParticipatedBefore: nextHasParticipatedBefore },
            where: { id },
        });
        await recordApplicationChange(tx, actor, ChangeLogAction.ApplicationPastParticipationUpdated, application, changes);
    });
    revalidateApplicationPaths();
};

export const updateApplicationJuryVotes = async (id: number, values: z.infer<typeof updateApplicationJuryVotesSchema>): Promise<void> => {
    const actor = await requireLoggedInUser();
    const { juryVotes } = updateApplicationJuryVotesSchema.parse(values);
    const nextJuryVotes = juryVotes.length === 0 ? null : juryVotes;

    await prismaClient.$transaction(async (tx) => {
        const application = await tx.participant.findUniqueOrThrow({ select: { id: true, juryVotes: true, name: true }, where: { id } });
        const previousJuryVotes = parseJuryVotes(application.juryVotes);
        const changes = filterChanges([createChange('juryVotes', 'Jury Votes', previousJuryVotes, nextJuryVotes, formatJuryVotes)]);

        if (changes.length === 0) {
            return;
        }

        await tx.participant.update({ data: { juryVotes: nextJuryVotes === null ? Prisma.DbNull : nextJuryVotes }, where: { id } });
        await recordApplicationChange(tx, actor, ChangeLogAction.ApplicationJuryVotesUpdated, application, changes);
    });
    revalidateApplicationPaths();
};

export const updateApplicationBookingInfo = async (
    id: number,
    values: z.infer<ReturnType<typeof createUpdateApplicationBookingInfoSchema>>,
): Promise<void> => {
    const actor = await requireLoggedInUser();
    const { participantCount } = await prismaClient.participant.findUniqueOrThrow({ select: { participantCount: true }, where: { id } });
    const { isProfessionalBooking, professionalParticipantsCount } =
        createUpdateApplicationBookingInfoSchema(participantCount).parse(values);
    const nextIsProfessionalBooking = isProfessionalBooking ?? false;
    const nextProfessionalParticipantsCount = nextIsProfessionalBooking ? participantCount : (professionalParticipantsCount ?? 0);

    await prismaClient.$transaction(async (tx) => {
        const application = await tx.participant.findUniqueOrThrow({
            select: { id: true, isProfessionalBooking: true, name: true, professionalParticipantsCount: true },
            where: { id },
        });
        const changes = filterChanges([
            createChange(
                'isProfessionalBooking',
                'Professionelles Booking',
                application.isProfessionalBooking,
                nextIsProfessionalBooking,
                formatBoolean,
            ),
            createChange(
                'professionalParticipantsCount',
                'Anzahl professioneller Personen',
                application.professionalParticipantsCount,
                nextProfessionalParticipantsCount,
                formatNullableNumber,
            ),
        ]);

        if (changes.length === 0) {
            return;
        }

        await tx.participant.update({
            data: {
                isProfessionalBooking: nextIsProfessionalBooking,
                professionalParticipantsCount: nextProfessionalParticipantsCount,
            },
            where: { id },
        });
        await recordApplicationChange(tx, actor, ChangeLogAction.ApplicationBookingInfoUpdated, application, changes);
    });
    revalidateApplicationPaths();
};

export const updateApplicationDiversityInfo = async (
    id: number,
    values: z.infer<ReturnType<typeof createUpdateApplicationDiversityInfoSchema>>,
): Promise<void> => {
    const actor = await requireLoggedInUser();
    const { participantCount } = await prismaClient.participant.findUniqueOrThrow({ select: { participantCount: true }, where: { id } });
    const { flintaParticipantsCount, hasMarginalizedParticipants, diversityNotes } =
        createUpdateApplicationDiversityInfoSchema(participantCount).parse(values);
    const normalizedDiversityNotes = normalizeOptionalText(diversityNotes);

    await prismaClient.$transaction(async (tx) => {
        const application = await tx.participant.findUniqueOrThrow({
            select: { diversityNotes: true, flintaParticipantsCount: true, hasMarginalizedParticipants: true, id: true, name: true },
            where: { id },
        });
        const changes = filterChanges([
            createChange(
                'flintaParticipantsCount',
                'FLINTA*-Personen',
                application.flintaParticipantsCount,
                flintaParticipantsCount,
                formatNullableNumber,
            ),
            createChange(
                'hasMarginalizedParticipants',
                'Marginalisierte Personen',
                application.hasMarginalizedParticipants,
                hasMarginalizedParticipants,
                formatBoolean,
            ),
            createChange('diversityNotes', 'Diversitätsnotizen', application.diversityNotes, normalizedDiversityNotes, formatNullableText),
        ]);

        if (changes.length === 0) {
            return;
        }

        await tx.participant.update({
            data: {
                flintaParticipantsCount,
                hasMarginalizedParticipants,
                diversityNotes: normalizedDiversityNotes,
            },
            where: { id },
        });
        await recordApplicationChange(tx, actor, ChangeLogAction.ApplicationDiversityInfoUpdated, application, changes);
    });
    revalidateApplicationPaths();
};

export const updateApplicationAdditionalInfo = async (
    id: number,
    values: z.infer<typeof updateApplicationAdditionalInfoSchema>,
): Promise<void> => {
    const actor = await requireLoggedInUser();
    const { additionalInfo } = updateApplicationAdditionalInfoSchema.parse(values);
    const normalizedAdditionalInfo = normalizeOptionalText(additionalInfo);

    await prismaClient.$transaction(async (tx) => {
        const application = await tx.participant.findUniqueOrThrow({
            select: { additionalInfo: true, id: true, name: true },
            where: { id },
        });
        const changes = filterChanges([
            createChange(
                'additionalInfo',
                'Weitere Informationen',
                application.additionalInfo,
                normalizedAdditionalInfo,
                formatNullableText,
            ),
        ]);

        if (changes.length === 0) {
            return;
        }

        await tx.participant.update({ data: { additionalInfo: normalizedAdditionalInfo }, where: { id } });
        await recordApplicationChange(tx, actor, ChangeLogAction.ApplicationAdditionalInfoUpdated, application, changes);
    });
    revalidateApplicationPaths();
};

export const updateApplicationContactInfo = async (
    id: number,
    values: z.infer<typeof updateApplicationContactInfoSchema>,
): Promise<void> => {
    const actor = await requireDataPrivacyUser();
    const { contactName, contactMail, contactPhone } = updateApplicationContactInfoSchema.parse(values);

    await prismaClient.$transaction(async (tx) => {
        const application = await tx.participant.findUniqueOrThrow({
            select: { contactMail: true, contactName: true, contactPhone: true, id: true, name: true },
            where: { id },
        });
        const changes = filterChanges([
            createChange('contactName', 'Ansprechperson', application.contactName, contactName, formatNullableText),
            createChange('contactMail', 'E-Mail-Adresse', application.contactMail, contactMail, formatNullableText),
            createChange('contactPhone', 'Telefonnummer', application.contactPhone, contactPhone, formatNullableText),
        ]);

        if (changes.length === 0) {
            return;
        }

        await tx.participant.update({ data: { contactName, contactMail, contactPhone }, where: { id } });
        await recordApplicationChange(tx, actor, ChangeLogAction.ApplicationContactInfoUpdated, application, changes);
    });
    revalidateApplicationPaths();
};

export const deleteApplicationImage = async (id: number): Promise<void> => {
    const actor = await requireLoggedInUser();

    await prismaClient.$transaction(async (tx) => {
        const application = await tx.participant.findUniqueOrThrow({
            select: { id: true, imageFileName: true, name: true },
            where: { id },
        });
        const changes = filterChanges([createChange('imageFileName', 'Bild', application.imageFileName, null, formatNullableText)]);

        if (changes.length === 0) {
            return;
        }

        await tx.participant.update({ data: { imageFileName: null }, where: { id } });
        await recordApplicationChange(tx, actor, ChangeLogAction.ApplicationImageDeleted, application, changes);
    });
    revalidateApplicationPaths();
};

export const replaceApplicationImage = async (id: number, encodedImage: string): Promise<void> => {
    const actor = await requireLoggedInUser();
    const imageFileName = await uploadFileToIonos(encodedImage, allowedImageContentTypes, allowedImageMaxFileSize);

    await prismaClient.$transaction(async (tx) => {
        const application = await tx.participant.findUniqueOrThrow({
            select: { id: true, imageFileName: true, name: true },
            where: { id },
        });
        const changes = filterChanges([
            createChange('imageFileName', 'Bild', application.imageFileName, imageFileName, formatNullableText),
        ]);

        if (changes.length === 0) {
            return;
        }

        await tx.participant.update({ data: { imageFileName }, where: { id } });
        await recordApplicationChange(tx, actor, ChangeLogAction.ApplicationImageReplaced, application, changes);
    });
    revalidateApplicationPaths();
};

export const setApplicationStatus = async (id: number, applicationStatus: ApplicationStatus, commentText?: string): Promise<void> => {
    const actor = await requireLoggedInUser();
    const normalizedComment = normalizeOptionalText(commentText);

    await prismaClient.$transaction(async (tx) => {
        const application = await tx.participant.findUniqueOrThrow({ select: { id: true, name: true, status: true }, where: { id } });
        const changes = filterChanges([createChange('status', 'Status', application.status, applicationStatus, formatApplicationStatus)]);

        if (changes.length === 0) {
            return;
        }

        await tx.participantLabel.deleteMany({ where: { participantId: id } });
        await tx.participant.update({ data: { status: applicationStatus }, where: { id } });

        if (normalizedComment !== null) {
            await tx.comment.create({
                data: {
                    authorName: getActionUserName(actor),
                    authorUserId: getActionUserId(actor),
                    participantId: id,
                    statusTransition: applicationStatus,
                    text: normalizedComment,
                },
            });
        }

        await recordApplicationChange(tx, actor, ChangeLogAction.ApplicationStatusUpdated, application, changes);
    });
    revalidateApplicationPaths();
};

export const setCuration = async (id: number, applicationStatus: ApplicationStatus): Promise<void> => {
    await setApplicationStatus(id, applicationStatus);
};

export const addComment = async (id: number, text: string): Promise<void> => {
    const actor = await requireLoggedInUser();
    const normalizedText = normalizeOptionalText(text);

    if (normalizedText === null) {
        return;
    }

    await prismaClient.comment.create({
        data: {
            authorName: getActionUserName(actor),
            authorUserId: getActionUserId(actor),
            participantId: id,
            text: normalizedText,
        },
    });
    revalidateApplicationPaths();
};

const normalizeOrganizerSnapshots = (
    organizers: Array<{ organizerName: string; organizerUserId: string }>,
): Array<OrganizerChangeLogSnapshot> =>
    organizers
        .map(({ organizerName, organizerUserId }) => ({ organizerName, organizerUserId }))
        .sort((left, right) => left.organizerUserId.localeCompare(right.organizerUserId));

export const setApplicationOrganizers = async (
    participantId: number,
    organizers: Array<{ organizerName: string; organizerUserId: string }>,
): Promise<void> => {
    const actor = await requireLoggedInUser();
    const nextOrganizers = normalizeOrganizerSnapshots(organizers);

    await prismaClient.$transaction(async (tx) => {
        const application = await tx.participant.findUniqueOrThrow({
            select: {
                id: true,
                name: true,
                organizers: { orderBy: { organizerName: 'asc' }, select: { organizerName: true, organizerUserId: true } },
            },
            where: { id: participantId },
        });
        const previousOrganizers = normalizeOrganizerSnapshots(application.organizers);
        const changes = filterChanges([createChange('organizers', 'Zuständigkeit', previousOrganizers, nextOrganizers, formatOrganizers)]);

        if (changes.length === 0) {
            return;
        }

        await tx.participantOrganizer.deleteMany({ where: { participantId } });

        if (nextOrganizers.length > 0) {
            await tx.participantOrganizer.createMany({
                data: nextOrganizers.map(({ organizerName, organizerUserId }) => ({
                    organizerName,
                    organizerUserId,
                    participantId,
                })),
            });
        }

        await recordApplicationChange(tx, actor, ChangeLogAction.ApplicationOrganizersUpdated, application, changes);
    });
    revalidateApplicationPaths();
};
