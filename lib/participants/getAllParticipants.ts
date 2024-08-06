import prismaClient from 'lib/common/prismaClient';
import type { Participant } from '@prisma/client';

const getAllParticipants = async (isInDataPrivacyGroup: boolean): Promise<Array<Participant>> => {
    const applications = await prismaClient.participant.findMany();

    if (isInDataPrivacyGroup) {
        return applications;
    }

    return applications
        .map<Participant>((application) => ({
            ...application,
            contactName: null,
            contactMail: null,
            contactPhone: null,
            motivation: null,
            curationScore: null,
            curationInfo: null,
            address: null,
            residence: null,
            technicalRider: null,
            technicalRiderFileName: null,
            backlineSharing: null,
            materialExpenses: null,
            additionalInfo: null,
        }))
        .filter(({ status }) => ['Confirmed', 'Canceled'].includes(status));
};

export default getAllParticipants;
