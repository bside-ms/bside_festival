import prismaClient from '@/lib/common/prismaClient';
import type { ApplicationStatus, Comment, Participant, ParticipantOrganizer } from '@prisma/client';

export type ParticipantWithInternRelations = Participant & {
    comments: Array<Comment>;
    organizers: Array<ParticipantOrganizer>;
};

const maskPrivateFields = (application: ParticipantWithInternRelations, isInDataPrivacyGroup: boolean): ParticipantWithInternRelations => {
    if (isInDataPrivacyGroup) {
        return application;
    }

    return {
        ...application,
        contactMail: '*******',
        contactPhone: application.contactPhone !== null ? '*******' : null,
        address: application.address !== null ? '*******' : null,
    };
};

const listOrganizerSelect = {
    organizerName: true,
    organizerUserId: true,
    participantId: true,
} as const;

const getAllParticipants = async (
    isInDataPrivacyGroup: boolean,
    includeOrganizers = false,
    statuses?: Array<ApplicationStatus>,
): Promise<Array<ParticipantWithInternRelations>> => {
    const where = statuses === undefined ? undefined : { status: { in: statuses } };

    if (!includeOrganizers) {
        const applications = (await prismaClient.participant.findMany({ orderBy: [{ appliedAt: 'asc' }, { id: 'asc' }], where })).map(
            (application) => ({
                ...application,
                comments: [],
                organizers: [],
            }),
        );

        return applications.map((application) => maskPrivateFields(application, isInDataPrivacyGroup));
    }

    const rows = await prismaClient.participant.findMany({
        orderBy: [{ appliedAt: 'asc' }, { id: 'asc' }],
        select: {
            id: true,
            name: true,
            type: true,
            status: true,
            appliedAt: true,
            updatedAt: true,
            description: true,
            contactName: true,
            contactMail: true,
            contactPhone: true,
            address: true,
            organizers: { orderBy: { organizerName: 'asc' }, select: listOrganizerSelect },
        },
        where,
    });

    const applications = rows.map(
        (row): ParticipantWithInternRelations => ({
            additionalInfo: null,
            allergies: null,
            appliedAt: row.appliedAt,
            backlineSharing: null,
            contactMail: row.contactMail,
            contactName: row.contactName,
            contactPhone: row.contactPhone,
            address: row.address,
            description: row.description,
            diversityNotes: null,
            durationPreference: null,
            emailVerified: null,
            feeEuros: null,
            flintaParticipantsCount: 0,
            hasMarginalizedParticipants: false,
            hasParticipatedBefore: null,
            id: row.id,
            imageFileName: null,
            isProfessionalBooking: false,
            juryVotes: null,
            motivation: null,
            name: row.name,
            participantCount: 1,
            professionalParticipantsCount: 0,
            status: row.status,
            technicalRider: null,
            technicalRiderFileName: null,
            type: row.type,
            updatedAt: row.updatedAt,
            updatedDescription: null,
            updatedName: null,
            comments: [],
            organizers: row.organizers as Array<ParticipantOrganizer>,
        }),
    );

    return applications.map((application) => maskPrivateFields(application, isInDataPrivacyGroup));
};

export default getAllParticipants;
