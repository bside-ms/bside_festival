import prismaClient from '@/lib/common/prismaClient';
import type { Participant } from '@prisma/client';

const getAllParticipants = async (isInDataPrivacyGroup: boolean): Promise<Array<Participant>> => {
    const applications = await prismaClient.participant.findMany({ orderBy: [{ appliedAt: 'asc' }, { id: 'asc' }] });

    if (isInDataPrivacyGroup) {
        return applications;
    }

    return applications.map<Participant>((application) => ({
        ...application,
        contactMail: '*******',
        contactPhone: application.contactPhone !== null ? '*******' : null,
        address: application.address !== null ? '*******' : null,
    }));
};

export default getAllParticipants;
