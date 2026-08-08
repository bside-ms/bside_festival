import prismaClient from '@/lib/common/prismaClient';
import serializeScheduleEntry from '@/lib/schedule/serializeScheduleEntry';
import type { SerializableScheduleEntry } from '@/typings/SerializableScheduleEntry';

const getScheduleEntriesByParticipantId = async (participantId: number): Promise<Array<SerializableScheduleEntry>> => {
    const scheduleEntries = await prismaClient.scheduleEntry.findMany({
        where: { participantId },
        orderBy: [{ startsAt: 'asc' }, { id: 'asc' }],
    });

    return scheduleEntries.map(serializeScheduleEntry);
};

export default getScheduleEntriesByParticipantId;
