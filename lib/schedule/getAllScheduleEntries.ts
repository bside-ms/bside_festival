import prismaClient from '@/lib/common/prismaClient';
import serializeScheduleEntry from '@/lib/schedule/serializeScheduleEntry';
import type { SerializableScheduleEntry } from '@/typings/SerializableScheduleEntry';
import type { ApplicationStatus, Prisma } from '@prisma/client';

interface Options {
    participantStatuses?: Array<ApplicationStatus>;
    publicOnly?: boolean;
}

const getAllScheduleEntries = async ({ participantStatuses, publicOnly = false }: Options = {}): Promise<
    Array<SerializableScheduleEntry>
> => {
    const participantWhere =
        participantStatuses === undefined
            ? undefined
            : ({ participant: { status: { in: participantStatuses } } } satisfies Prisma.ScheduleEntryWhereInput);
    const publicWhere = publicOnly
        ? ({
              OR: [
                  {
                      kind: 'Participant',
                      participant: { status: { in: participantStatuses ?? ['Confirmed', 'Canceled'] } },
                  },
                  { kind: 'ScheduleNote', isPublic: true },
              ],
          } satisfies Prisma.ScheduleEntryWhereInput)
        : undefined;

    const scheduleEntries = await prismaClient.scheduleEntry.findMany({
        orderBy: [{ startsAt: 'asc' }, { id: 'asc' }],
        where: publicWhere ?? participantWhere,
    });

    return scheduleEntries.map(serializeScheduleEntry);
};

export default getAllScheduleEntries;
