import prismaClient from '@/lib/common/prismaClient';

const getAssignedOrganizerUserIds = async (): Promise<Array<string>> => {
    const rows = await prismaClient.participantOrganizer.findMany({
        distinct: ['organizerUserId'],
        select: { organizerUserId: true },
    });

    return rows.map(({ organizerUserId }) => organizerUserId);
};

export default getAssignedOrganizerUserIds;
