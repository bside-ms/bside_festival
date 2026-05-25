'use server';

import { requireLoggedInUser, type ActionUser } from '@/lib/actions/actionAuth';
import { formatDateTime, formatNullableNumber, formatNullableText } from '@/lib/changeLog/changeLogLabels';
import type { ChangeLogChange } from '@/lib/changeLog/changeLogTypes';
import { createChange } from '@/lib/changeLog/createChange';
import { recordChangeLogEntry } from '@/lib/changeLog/recordChangeLogEntry';
import prismaClient from '@/lib/common/prismaClient';
import sendSlotAttendConfirmationMail from '@/lib/mail/sendSlotAttendConfirmationMail';
import { ChangeLogAction, ChangeLogTargetType, type Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export interface AttendSlotError {
    errorCode: number;
}

const filterChanges = (changes: Array<ChangeLogChange | null>): Array<ChangeLogChange> =>
    changes.filter((change): change is ChangeLogChange => change !== null);

const revalidateSlotPaths = (): void => {
    revalidatePath('/intern');
    revalidatePath('/intern/kuration');
    revalidatePath('/bewerbungen/uebersicht');
    revalidatePath('/programm');
    revalidatePath('/programm/timetable');
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

export const updateSlot = async (
    participantId: number,
    locationId: number,
    begin: Date,
    duration: number,
    maxAttendees?: number,
): Promise<void> => {
    const actor = await requireLoggedInUser();
    const nextMaxAttendees = maxAttendees ?? null;

    await prismaClient.$transaction(async (tx) => {
        const participant = await tx.participant.findUniqueOrThrow({ select: { id: true, name: true }, where: { id: participantId } });
        const previousSlot = await tx.slot.findFirst({ include: { location: true }, where: { participantId } });
        const nextLocation = await tx.location.findUniqueOrThrow({ select: { name: true }, where: { id: locationId } });
        const changes = filterChanges([
            createChange('begin', 'Beginn', previousSlot?.begin ?? null, begin, formatDateTime),
            createChange('duration', 'Dauer in Minuten', previousSlot?.duration ?? null, duration, formatNullableNumber),
            createChange('locationId', 'Ort', previousSlot?.location.name ?? null, nextLocation.name, formatNullableText),
            createChange(
                'maxAttendees',
                'Maximale Anmeldungen',
                previousSlot?.maxAttendees ?? null,
                nextMaxAttendees,
                formatNullableNumber,
            ),
        ]);

        if (changes.length === 0) {
            return;
        }

        await tx.slot.deleteMany({ where: { participantId } });
        await tx.slot.create({ data: { participantId, locationId, begin, duration, maxAttendees: nextMaxAttendees } });
        await recordProgramEntryChange(tx, actor, ChangeLogAction.ProgramSlotUpdated, participant, changes);
    });
    revalidateSlotPaths();
};

export const deleteSlot = async (participantId: number): Promise<void> => {
    const actor = await requireLoggedInUser();

    await prismaClient.$transaction(async (tx) => {
        const participant = await tx.participant.findUniqueOrThrow({ select: { id: true, name: true }, where: { id: participantId } });
        const previousSlot = await tx.slot.findFirst({ include: { location: true }, where: { participantId } });

        if (previousSlot === null) {
            return;
        }

        const changes = filterChanges([
            createChange('begin', 'Beginn', previousSlot.begin, null, formatDateTime),
            createChange('duration', 'Dauer in Minuten', previousSlot.duration, null, formatNullableNumber),
            createChange('locationId', 'Ort', previousSlot.location.name, null, formatNullableText),
            createChange('maxAttendees', 'Maximale Anmeldungen', previousSlot.maxAttendees, null, formatNullableNumber),
        ]);

        await tx.slot.deleteMany({ where: { participantId } });
        await recordProgramEntryChange(tx, actor, ChangeLogAction.ProgramSlotDeleted, participant, changes);
    });
    revalidateSlotPaths();
};

export const attendSlot = async (slotId: number, fullName: string, mailAddress: string): Promise<AttendSlotError | null> => {
    const existingAttendee = await prismaClient.attendee.findFirst({ where: { slotId, fullName, mailAddress } });

    if (existingAttendee !== null) {
        return { errorCode: 1721561870451 };
    }

    await prismaClient.attendee.create({ data: { slotId, fullName, mailAddress, attendedAt: new Date() } });

    const slot = await prismaClient.slot.findUnique({ where: { id: slotId } });
    const participant = await prismaClient.participant.findUnique({ where: { id: slot?.participantId } });
    const location = await prismaClient.location.findUnique({ where: { id: slot?.locationId } });

    if (slot !== null && participant !== null && location !== null) {
        sendSlotAttendConfirmationMail(participant, slot, location, fullName, mailAddress);
    }

    revalidatePath('/programm');

    return null;
};
