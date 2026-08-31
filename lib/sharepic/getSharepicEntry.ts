import isEmptyString from '@/lib/common/helper/isEmptyString';
import prismaClient from '@/lib/common/prismaClient';
import createPublicObjectUrl from '@/lib/upload/createPublicObjectUrl';
import { ApplicationStatus, type ScheduleEntryTimeMode } from '@prisma/client';

export type SharepicEntry = {
    canceled: boolean;
    hasPhoto: boolean;
    id: number;
    name: string;
    photoUrl: string | null;
    scheduleEntries: Array<{
        allDayDates: unknown;
        id: number;
        programLocation: { name: string };
        startsAt: Date | null;
        timeMode: ScheduleEntryTimeMode;
    }>;
};

const getSharepicEntry = async (id: number): Promise<SharepicEntry | null> => {
    if (!Number.isInteger(id) || id < 1) {
        return null;
    }

    const participant = await prismaClient.participant.findFirst({
        where: { id, status: { in: [ApplicationStatus.Confirmed, ApplicationStatus.Canceled] } },
        include: {
            scheduleEntries: {
                include: { programLocation: true },
                orderBy: [{ startsAt: 'asc' }, { id: 'asc' }],
            },
        },
    });

    if (participant === null) {
        return null;
    }

    const imageFileName = participant.imageFileName;
    const hasPhoto = !isEmptyString(imageFileName);

    return {
        canceled: participant.status === ApplicationStatus.Canceled,
        hasPhoto,
        id: participant.id,
        name: participant.name,
        photoUrl: isEmptyString(imageFileName) ? null : createPublicObjectUrl(imageFileName),
        scheduleEntries: participant.scheduleEntries.map((entry) => ({
            allDayDates: entry.allDayDates,
            id: entry.id,
            programLocation: { name: entry.programLocation.name },
            startsAt: entry.startsAt,
            timeMode: entry.timeMode,
        })),
    };
};

export default getSharepicEntry;
