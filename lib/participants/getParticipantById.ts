import prismaClient from '@/lib/common/prismaClient';
import type { ParticipantWithInternRelations } from '@/lib/participants/getAllParticipants';

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

const getParticipantById = async (id: number, isInDataPrivacyGroup: boolean): Promise<ParticipantWithInternRelations | null> => {
    const application = await prismaClient.participant.findUnique({
        include: {
            comments: { orderBy: { createdAt: 'desc' } },
            organizers: { orderBy: { organizerName: 'asc' } },
        },
        where: { id },
    });

    if (application === null) {
        return null;
    }

    return maskPrivateFields(application, isInDataPrivacyGroup);
};

export default getParticipantById;
