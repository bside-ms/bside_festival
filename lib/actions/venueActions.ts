'use server';

import { requireLoggedInUser, type ActionUser } from '@/lib/actions/actionAuth';
import { formatNullableText } from '@/lib/changeLog/changeLogLabels';
import type { ChangeLogChange } from '@/lib/changeLog/changeLogTypes';
import { createChange } from '@/lib/changeLog/createChange';
import { recordChangeLogEntry } from '@/lib/changeLog/recordChangeLogEntry';
import prismaClient from '@/lib/common/prismaClient';
import { ChangeLogAction, ChangeLogTargetType, type Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const filterChanges = (changes: Array<ChangeLogChange | null>): Array<ChangeLogChange> =>
    changes.filter((change): change is ChangeLogChange => change !== null);

const revalidateVenuePaths = (): void => {
    revalidatePath('/bewerbungen/uebersicht');
    revalidatePath('/programm');
    revalidatePath('/aenderungslog');
};

const recordProgramEntryChange = async (
    tx: Prisma.TransactionClient,
    actor: ActionUser,
    action: ChangeLogAction,
    participant: { id: number; name: string },
    changes: Array<ChangeLogChange>,
): Promise<void> => {
    await recordChangeLogEntry(tx, actor, {
        action,
        target: { type: ChangeLogTargetType.ProgramEntry, id: participant.id, name: participant.name },
        changes,
    });
};

export const updateVenue = async (participantId: number, locationId: number, dates: Array<string>): Promise<void> => {
    const actor = await requireLoggedInUser();
    const nextDates = dates.join(',');

    await prismaClient.$transaction(async (tx) => {
        const participant = await tx.participant.findUniqueOrThrow({ select: { id: true, name: true }, where: { id: participantId } });
        const previousVenue = await tx.venue.findFirst({ include: { location: true }, where: { participantId } });
        const nextLocation = await tx.location.findUniqueOrThrow({ select: { name: true }, where: { id: locationId } });
        const changes = filterChanges([
            createChange('locationId', 'Ort', previousVenue?.location.name ?? null, nextLocation.name, formatNullableText),
            createChange('dates', 'Tage', previousVenue?.dates ?? null, nextDates, formatNullableText),
        ]);

        if (changes.length === 0) {
            return;
        }

        await tx.venue.deleteMany({ where: { participantId } });
        await tx.venue.create({ data: { participantId, locationId, dates: nextDates } });
        await recordProgramEntryChange(tx, actor, ChangeLogAction.ProgramVenueUpdated, participant, changes);
    });
    revalidateVenuePaths();
};

export const deleteVenue = async (participantId: number): Promise<void> => {
    const actor = await requireLoggedInUser();

    await prismaClient.$transaction(async (tx) => {
        const participant = await tx.participant.findUniqueOrThrow({ select: { id: true, name: true }, where: { id: participantId } });
        const previousVenue = await tx.venue.findFirst({ include: { location: true }, where: { participantId } });

        if (previousVenue === null) {
            return;
        }

        const changes = filterChanges([
            createChange('locationId', 'Ort', previousVenue.location.name, null, formatNullableText),
            createChange('dates', 'Tage', previousVenue.dates, null, formatNullableText),
        ]);

        await tx.venue.deleteMany({ where: { participantId } });
        await recordProgramEntryChange(tx, actor, ChangeLogAction.ProgramVenueDeleted, participant, changes);
    });
    revalidateVenuePaths();
};
