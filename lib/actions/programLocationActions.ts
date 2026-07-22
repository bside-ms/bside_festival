'use server';

import { requireLoggedInUser, type ActionUser } from '@/lib/actions/actionAuth';
import { revalidateProgramPaths } from '@/lib/actions/actionRevalidation';
import { formatBoolean, formatNullableNumber, formatNullableText } from '@/lib/changeLog/changeLogLabels';
import type { ChangeLogChange } from '@/lib/changeLog/changeLogTypes';
import { createChange } from '@/lib/changeLog/createChange';
import { recordChangeLogEntry } from '@/lib/changeLog/recordChangeLogEntry';
import prismaClient from '@/lib/common/prismaClient';
import { ChangeLogAction, ChangeLogTargetType, type Prisma, type ProgramLocation } from '@prisma/client';

export interface ProgramLocationInput {
    name: string;
    programLocationAreaId?: number | null;
    sortOrder: number;
    address?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    awarenessInfo?: string | null;
    isActive: boolean;
}

const normalizeText = (value: string | null | undefined): string | null => {
    const trimmedValue = value?.trim() ?? '';

    return trimmedValue.length === 0 ? null : trimmedValue;
};

const filterChanges = (changes: Array<ChangeLogChange | null>): Array<ChangeLogChange> =>
    changes.filter((change): change is ChangeLogChange => change !== null);

const validateProgramLocationInput = (input: ProgramLocationInput): ProgramLocationInput => {
    const name = normalizeText(input.name);

    if (name === null) {
        throw new Error('Der Programmort braucht einen Namen.');
    }

    return {
        name,
        programLocationAreaId: input.programLocationAreaId ?? null,
        sortOrder: Number.isFinite(input.sortOrder) ? Math.trunc(input.sortOrder) : 0,
        address: normalizeText(input.address),
        latitude: input.latitude ?? null,
        longitude: input.longitude ?? null,
        awarenessInfo: normalizeText(input.awarenessInfo),
        isActive: input.isActive,
    };
};

const createProgramLocationChanges = (
    previousLocation: ProgramLocation | null,
    nextLocation: ProgramLocationInput | null,
): Array<ChangeLogChange> =>
    filterChanges([
        createChange('name', 'Name', previousLocation?.name ?? null, nextLocation?.name ?? null, formatNullableText),
        createChange(
            'programLocationAreaId',
            'Bereich',
            previousLocation?.programLocationAreaId ?? null,
            nextLocation?.programLocationAreaId ?? null,
            formatNullableNumber,
        ),
        createChange('sortOrder', 'Sortierung', previousLocation?.sortOrder ?? null, nextLocation?.sortOrder ?? null, formatNullableNumber),
        createChange('address', 'Adresse', previousLocation?.address ?? null, nextLocation?.address ?? null, formatNullableText),
        createChange('latitude', 'Breitengrad', previousLocation?.latitude ?? null, nextLocation?.latitude ?? null, formatNullableNumber),
        createChange('longitude', 'Längengrad', previousLocation?.longitude ?? null, nextLocation?.longitude ?? null, formatNullableNumber),
        createChange(
            'awarenessInfo',
            'Barrierefreiheit',
            previousLocation?.awarenessInfo ?? null,
            nextLocation?.awarenessInfo ?? null,
            formatNullableText,
        ),
        createChange('isActive', 'Aktiv', previousLocation?.isActive ?? null, nextLocation?.isActive ?? null, (value) =>
            value === null ? 'keine Angabe' : formatBoolean(value),
        ),
    ]);

const recordProgramLocationChange = async (
    tx: Prisma.TransactionClient,
    actor: ActionUser,
    action: ChangeLogAction,
    programLocation: { id: number; name: string },
    changes: Array<ChangeLogChange>,
): Promise<void> => {
    await recordChangeLogEntry(tx, actor, {
        action,
        target: { type: ChangeLogTargetType.ProgramLocation, id: programLocation.id, name: programLocation.name },
        changes,
    });
};

export const createProgramLocation = async (input: ProgramLocationInput): Promise<void> => {
    const actor = await requireLoggedInUser();
    const data = validateProgramLocationInput(input);

    await prismaClient.$transaction(async (tx) => {
        const programLocation = await tx.programLocation.create({ data });
        await recordProgramLocationChange(
            tx,
            actor,
            ChangeLogAction.ProgramLocationCreated,
            programLocation,
            createProgramLocationChanges(null, data),
        );
    });
    revalidateProgramPaths();
};

export const updateProgramLocation = async (id: number, input: ProgramLocationInput): Promise<void> => {
    const actor = await requireLoggedInUser();
    const data = validateProgramLocationInput(input);

    await prismaClient.$transaction(async (tx) => {
        const previousLocation = await tx.programLocation.findUniqueOrThrow({ where: { id } });
        const changes = createProgramLocationChanges(previousLocation, data);

        if (changes.length === 0) {
            return;
        }

        const programLocation = await tx.programLocation.update({ data, where: { id } });
        await recordProgramLocationChange(tx, actor, ChangeLogAction.ProgramLocationUpdated, programLocation, changes);
    });
    revalidateProgramPaths();
};

export const deleteUnusedProgramLocation = async (id: number): Promise<void> => {
    const actor = await requireLoggedInUser();

    await prismaClient.$transaction(async (tx) => {
        const previousLocation = await tx.programLocation.findUniqueOrThrow({ where: { id } });
        const scheduleEntryCount = await tx.scheduleEntry.count({ where: { programLocationId: id } });

        if (scheduleEntryCount > 0) {
            const programLocation = await tx.programLocation.update({ data: { isActive: false }, where: { id } });
            await recordProgramLocationChange(
                tx,
                actor,
                ChangeLogAction.ProgramLocationDeactivated,
                programLocation,
                filterChanges([createChange('isActive', 'Aktiv', previousLocation.isActive, false, formatBoolean)]),
            );
            return;
        }

        await tx.programLocation.delete({ where: { id } });
        await recordProgramLocationChange(
            tx,
            actor,
            ChangeLogAction.ProgramLocationDeleted,
            previousLocation,
            createProgramLocationChanges(previousLocation, null),
        );
    });
    revalidateProgramPaths();
};
