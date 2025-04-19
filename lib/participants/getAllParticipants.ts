import type { Participant } from '@prisma/client';
import prismaClient from 'lib/common/prismaClient';

const getAllParticipants = async (isInDataPrivacyGroup: boolean): Promise<Array<Participant>> => {
    const applications = await prismaClient.participant.findMany();

    if (isInDataPrivacyGroup) {
        return applications;
    }

    return applications.map<Participant>((application) => ({
        ...application,
        contactMail: null,
        contactPhone: null,
        address: null,
    }));
};

export default getAllParticipants;
