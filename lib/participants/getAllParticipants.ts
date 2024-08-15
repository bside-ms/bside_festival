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
            contactMail: null,
            contactPhone: null,
            address: null,
        }))
        .filter(({ status }) => ['Confirmed', 'Canceled'].includes(status));
};

export default getAllParticipants;
