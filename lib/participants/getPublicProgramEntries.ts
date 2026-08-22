import prismaClient from '@/lib/common/prismaClient';
import type PublicProgramEntry from '@/typings/PublicProgramEntry';
import { ApplicationStatus } from '@prisma/client';

const getPublicProgramEntries = async (): Promise<Array<PublicProgramEntry>> =>
    prismaClient.participant.findMany({
        where: { status: { in: [ApplicationStatus.Confirmed, ApplicationStatus.Canceled] } },
        select: {
            id: true,
            imageFileName: true,
            name: true,
            status: true,
            type: true,
        },
    });

export default getPublicProgramEntries;
