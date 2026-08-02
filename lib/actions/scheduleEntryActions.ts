'use server';

import { requireLoggedInUser, type ActionUser } from '@/lib/actions/actionAuth';
import { revalidateProgramPaths } from '@/lib/actions/actionRevalidation';
import { formatBoolean, formatDateTime, formatNullableNumber, formatNullableText } from '@/lib/changeLog/changeLogLabels';
import type { ChangeLogChange } from '@/lib/changeLog/changeLogTypes';
import { createChange } from '@/lib/changeLog/createChange';
import { recordChangeLogEntry } from '@/lib/changeLog/recordChangeLogEntry';
import isNotEmptyNumber from '@/lib/common/helper/isNotEmptyNumber';
import prismaClient from '@/lib/common/prismaClient';
import { loggedAction } from '@/lib/errorLog/loggedAction';
import sendSlotAttendConfirmationMail from '@/lib/mail/sendSlotAttendConfirmationMail';
import { festivalAllDayDates, festivalEndsAt, festivalStartsAt, scheduleStepMinutes } from '@/lib/schedule/festivalWindow';
import {
    ChangeLogAction,
    ChangeLogTargetType,
    ScheduleEntryKind,
    ScheduleEntryTimeMode,
    type Prisma,
    type ScheduleEntry,
} from '@prisma/client';
import { addDays, isAfter, isBefore, parseISO, startOfDay } from 'date-fns';
import { fromZonedTime } from 'date-fns-tz';
import { sortBy } from 'lodash';

export interface AttendScheduleEntryError {
    errorCode: number;
}

export interface ScheduleEntryInput {
    kind: ScheduleEntryKind;
    timeMode: ScheduleEntryTimeMode;
    programLocationId: number;
    participantId?: number | null;
    title?: string | null;
    startsAt?: string | Date | null;
    endsAt?: string | Date | null;
    allDayDates?: Array<string>;
    isBlocking: boolean;
    isPublic: boolean;
    maxAttendees?: number | null;
}

interface ScheduleEntryData {
    kind: ScheduleEntryKind;
    timeMode: ScheduleEntryTimeMode;
    programLocationId: number;
    participantId: number | null;
    title: string | null;
    startsAt: Date | null;
    endsAt: Date | null;
    allDayDates: Array<string>;
    isBlocking: boolean;
    isPublic: boolean;
    maxAttendees: number | null;
}

interface Interval {
    startsAt: Date;
    endsAt: Date;
}

const duplicateRegistrationErrorCode = 1721561870451;
const fullRegistrationErrorCode = 1721561870452;
const unavailableRegistrationErrorCode = 1721561870453;

const normalizeText = (value: string | null | undefined): string | null => {
    const trimmedValue = value?.trim() ?? '';

    return trimmedValue.length === 0 ? null : trimmedValue;
};

const filterChanges = (changes: Array<ChangeLogChange | null>): Array<ChangeLogChange> =>
    changes.filter((change): change is ChangeLogChange => change !== null);

const parseDateValue = (value: Date | string | null | undefined): Date | null => {
    if (value === null || value === undefined || value === '') {
        return null;
    }

    if (value instanceof Date) {
        return value;
    }

    // datetime-local inputs produce timezone-naive strings; treat them as Europe/Berlin local time
    return fromZonedTime(value, 'Europe/Berlin');
};

const assertInsideFestivalWindow = (startsAt: Date, endsAt: Date): void => {
    if (isBefore(startsAt, festivalStartsAt) || isAfter(endsAt, festivalEndsAt)) {
        throw new Error('Der Slotplan-Eintrag liegt außerhalb des Festivalzeitraums.');
    }
};

const assertFifteenMinuteIncrement = (date: Date): void => {
    if (date.getMinutes() % scheduleStepMinutes !== 0 || date.getSeconds() !== 0 || date.getMilliseconds() !== 0) {
        throw new Error('Slotplan-Einträge müssen im 15-Minuten-Raster liegen.');
    }
};

const getAllDayInterval = (date: string): Interval => {
    const startsAt = startOfDay(parseISO(date));

    return { startsAt, endsAt: addDays(startsAt, 1) };
};

const getEntryIntervals = (entry: Pick<ScheduleEntryData, 'allDayDates' | 'endsAt' | 'startsAt' | 'timeMode'>): Array<Interval> => {
    if (entry.timeMode === ScheduleEntryTimeMode.Timed && entry.startsAt !== null && entry.endsAt !== null) {
        return [{ startsAt: entry.startsAt, endsAt: entry.endsAt }];
    }

    return entry.allDayDates.map(getAllDayInterval);
};

const getPersistedEntryIntervals = (entry: Pick<ScheduleEntry, 'allDayDates' | 'endsAt' | 'startsAt' | 'timeMode'>): Array<Interval> => {
    const allDayDates = getPersistedAllDayDates(entry);

    return getEntryIntervals({
        timeMode: entry.timeMode,
        startsAt: entry.startsAt,
        endsAt: entry.endsAt,
        allDayDates,
    });
};

const getPersistedAllDayDates = (entry: Pick<ScheduleEntry, 'allDayDates'>): Array<string> =>
    Array.isArray(entry.allDayDates) ? entry.allDayDates.filter((date): date is string => typeof date === 'string') : [];

const intervalsOverlap = (left: Interval, right: Interval): boolean =>
    isBefore(left.startsAt, right.endsAt) && isAfter(left.endsAt, right.startsAt);

const validateScheduleEntryInput = (input: ScheduleEntryInput): ScheduleEntryData => {
    const participantId = input.kind === ScheduleEntryKind.Participant ? (input.participantId ?? null) : null;
    const title = input.kind === ScheduleEntryKind.ScheduleNote ? normalizeText(input.title) : null;
    const startsAt = parseDateValue(input.startsAt);
    const endsAt = parseDateValue(input.endsAt);
    const allDayDates = sortBy(input.allDayDates ?? []);
    const maxAttendees =
        input.kind === ScheduleEntryKind.Participant && input.timeMode === ScheduleEntryTimeMode.Timed
            ? (input.maxAttendees ?? null)
            : null;

    if (input.kind === ScheduleEntryKind.Participant && participantId === null) {
        throw new Error('Teilnehmer:innen-Einträge brauchen einen Programmbeitrag.');
    }

    if (input.kind === ScheduleEntryKind.ScheduleNote && title === null) {
        throw new Error('Hinweise brauchen einen Titel.');
    }

    if (input.timeMode === ScheduleEntryTimeMode.Timed) {
        if (startsAt === null || endsAt === null) {
            throw new Error('Zeitliche Einträge brauchen Start und Ende.');
        }

        if (!isBefore(startsAt, endsAt)) {
            throw new Error('Das Ende muss nach dem Start liegen.');
        }

        assertFifteenMinuteIncrement(startsAt);
        assertFifteenMinuteIncrement(endsAt);
        assertInsideFestivalWindow(startsAt, endsAt);
    }

    if (input.timeMode === ScheduleEntryTimeMode.AllDay) {
        if (allDayDates.length === 0) {
            throw new Error('Ganztägige Einträge brauchen mindestens einen Tag.');
        }

        const validDates = festivalAllDayDates();

        if (allDayDates.some((date) => !validDates.includes(date))) {
            throw new Error('Ganztägige Einträge müssen im Festivalzeitraum liegen.');
        }
    }

    if (maxAttendees !== null && (!Number.isInteger(maxAttendees) || maxAttendees <= 0)) {
        throw new Error('Die maximale Anmeldung muss eine positive ganze Zahl sein.');
    }

    return {
        kind: input.kind,
        timeMode: input.timeMode,
        programLocationId: input.programLocationId,
        participantId,
        title,
        startsAt: input.timeMode === ScheduleEntryTimeMode.Timed ? startsAt : null,
        endsAt: input.timeMode === ScheduleEntryTimeMode.Timed ? endsAt : null,
        allDayDates: input.timeMode === ScheduleEntryTimeMode.AllDay ? allDayDates : [],
        isBlocking: input.isBlocking,
        isPublic: input.kind === ScheduleEntryKind.ScheduleNote ? input.isPublic : false,
        maxAttendees,
    };
};

const assertNoBlockingOverlap = async (tx: Prisma.TransactionClient, data: ScheduleEntryData, scheduleEntryId?: number): Promise<void> => {
    if (!data.isBlocking) {
        return;
    }

    const nextIntervals = getEntryIntervals(data);
    const blockingEntries = await tx.scheduleEntry.findMany({
        where: {
            id: scheduleEntryId === undefined ? undefined : { not: scheduleEntryId },
            isBlocking: true,
            programLocationId: data.programLocationId,
        },
    });

    const conflictingEntry = blockingEntries.find((entry) => {
        const previousIntervals = getPersistedEntryIntervals(entry);

        return previousIntervals.some((previousInterval) =>
            nextIntervals.some((nextInterval) => intervalsOverlap(previousInterval, nextInterval)),
        );
    });

    if (conflictingEntry !== undefined) {
        throw new Error(`Dieser Eintrag überschneidet sich mit Slotplan-Eintrag #${conflictingEntry.id}.`);
    }
};

const formatAllDayDates = (dates: Array<string> | null): string => {
    if (dates === null || dates.length === 0) {
        return 'keine Angabe';
    }

    return dates.join(', ');
};

const getScheduleEntryName = (entry: ScheduleEntry & { participant?: { name: string } | null }): string =>
    entry.kind === ScheduleEntryKind.Participant
        ? (entry.participant?.name ?? `Programmbeitrag #${entry.participantId}`)
        : (entry.title ?? 'Hinweis');

const createScheduleEntryChanges = (
    previousEntry: ScheduleEntry | null,
    nextEntry: ScheduleEntryData | null,
    previousParticipantName: string | null,
    nextParticipantName: string | null,
    previousProgramLocationName: string | null,
    nextProgramLocationName: string | null,
): Array<ChangeLogChange> =>
    filterChanges([
        createChange('kind', 'Art', previousEntry?.kind ?? null, nextEntry?.kind ?? null, formatNullableText),
        createChange('timeMode', 'Zeitmodus', previousEntry?.timeMode ?? null, nextEntry?.timeMode ?? null, formatNullableText),
        createChange('participantId', 'Programmbeitrag', previousParticipantName, nextParticipantName, formatNullableText),
        createChange('title', 'Hinweis', previousEntry?.title ?? null, nextEntry?.title ?? null, formatNullableText),
        createChange('programLocationId', 'Programmort', previousProgramLocationName, nextProgramLocationName, formatNullableText),
        createChange('startsAt', 'Start', previousEntry?.startsAt ?? null, nextEntry?.startsAt ?? null, formatDateTime),
        createChange('endsAt', 'Ende', previousEntry?.endsAt ?? null, nextEntry?.endsAt ?? null, formatDateTime),
        createChange(
            'allDayDates',
            'Ganztägige Tage',
            previousEntry === null ? null : getPersistedAllDayDates(previousEntry),
            nextEntry?.allDayDates ?? null,
            formatAllDayDates,
        ),
        createChange('isBlocking', 'Blockiert Ort', previousEntry?.isBlocking ?? null, nextEntry?.isBlocking ?? null, (value) =>
            value === null ? 'keine Angabe' : formatBoolean(value),
        ),
        createChange('isPublic', 'Öffentlich', previousEntry?.isPublic ?? null, nextEntry?.isPublic ?? null, (value) =>
            value === null ? 'keine Angabe' : formatBoolean(value),
        ),
        createChange(
            'maxAttendees',
            'Maximale Anmeldungen',
            previousEntry?.maxAttendees ?? null,
            nextEntry?.maxAttendees ?? null,
            formatNullableNumber,
        ),
    ]);

const recordScheduleEntryChange = async (
    tx: Prisma.TransactionClient,
    actor: ActionUser,
    action: ChangeLogAction,
    entry: ScheduleEntry & { participant?: { name: string } | null },
    changes: Array<ChangeLogChange>,
): Promise<void> => {
    await recordChangeLogEntry(tx, actor, {
        action,
        target: { type: ChangeLogTargetType.ScheduleEntry, id: entry.id, name: getScheduleEntryName(entry) },
        changes,
    });
};

export const createScheduleEntry = loggedAction(
    'createScheduleEntry',
    async (input: ScheduleEntryInput): Promise<void> => {
        const actor = await requireLoggedInUser();
        const data = validateScheduleEntryInput(input);

        await prismaClient.$transaction(async (tx) => {
            const programLocation = await tx.programLocation.findUniqueOrThrow({ where: { id: data.programLocationId } });
            const participant =
                data.participantId === null
                    ? null
                    : await tx.participant.findUniqueOrThrow({ select: { name: true }, where: { id: data.participantId } });

            await assertNoBlockingOverlap(tx, data);

            const scheduleEntry = await tx.scheduleEntry.create({
                data: {
                    ...data,
                    allDayDates: data.allDayDates,
                },
                include: { participant: { select: { name: true } } },
            });
            await recordScheduleEntryChange(
                tx,
                actor,
                ChangeLogAction.ScheduleEntryCreated,
                scheduleEntry,
                createScheduleEntryChanges(null, data, null, participant?.name ?? null, null, programLocation.name),
            );
        });
        revalidateProgramPaths();
    },
    (input) => ({
        targetType: 'ScheduleEntry',
        context: { kind: input.kind, participantId: input.participantId ?? null, programLocationId: input.programLocationId },
    }),
);

export const updateScheduleEntry = loggedAction(
    'updateScheduleEntry',
    async (id: number, input: ScheduleEntryInput): Promise<void> => {
        const actor = await requireLoggedInUser();
        const data = validateScheduleEntryInput(input);

        await prismaClient.$transaction(async (tx) => {
            const previousEntry = await tx.scheduleEntry.findUniqueOrThrow({
                include: { participant: { select: { name: true } } },
                where: { id },
            });
            const programLocation = await tx.programLocation.findUniqueOrThrow({ where: { id: data.programLocationId } });
            const previousProgramLocation = await tx.programLocation.findUniqueOrThrow({ where: { id: previousEntry.programLocationId } });
            const participant =
                data.participantId === null
                    ? null
                    : await tx.participant.findUniqueOrThrow({ select: { name: true }, where: { id: data.participantId } });

            await assertNoBlockingOverlap(tx, data, id);

            const changes = createScheduleEntryChanges(
                previousEntry,
                data,
                previousEntry.participant?.name ?? null,
                participant?.name ?? null,
                previousProgramLocation.name,
                programLocation.name,
            );

            if (changes.length === 0) {
                return;
            }

            const scheduleEntry = await tx.scheduleEntry.update({
                data: {
                    ...data,
                    allDayDates: data.allDayDates,
                },
                include: { participant: { select: { name: true } } },
                where: { id },
            });
            await recordScheduleEntryChange(tx, actor, ChangeLogAction.ScheduleEntryUpdated, scheduleEntry, changes);
        });
        revalidateProgramPaths();
    },
    (id, input) => ({
        targetType: 'ScheduleEntry',
        targetId: id,
        context: { kind: input.kind, programLocationId: input.programLocationId },
    }),
);

export const deleteScheduleEntry = loggedAction(
    'deleteScheduleEntry',
    async (id: number): Promise<void> => {
        const actor = await requireLoggedInUser();

        await prismaClient.$transaction(async (tx) => {
            const previousEntry = await tx.scheduleEntry.findUniqueOrThrow({
                include: { participant: { select: { name: true } } },
                where: { id },
            });
            const previousProgramLocation = await tx.programLocation.findUniqueOrThrow({ where: { id: previousEntry.programLocationId } });

            await tx.scheduleEntry.delete({ where: { id } });
            await recordScheduleEntryChange(
                tx,
                actor,
                ChangeLogAction.ScheduleEntryDeleted,
                previousEntry,
                createScheduleEntryChanges(
                    previousEntry,
                    null,
                    previousEntry.participant?.name ?? null,
                    null,
                    previousProgramLocation.name,
                    null,
                ),
            );
        });
        revalidateProgramPaths();
    },
    (id) => ({ targetType: 'ScheduleEntry', targetId: id }),
);

export const attendScheduleEntry = loggedAction(
    'attendScheduleEntry',
    async (scheduleEntryId: number, fullName: string, mailAddress: string): Promise<AttendScheduleEntryError | null> => {
        const scheduleEntry = await prismaClient.scheduleEntry.findUnique({
            include: { participant: true, programLocation: true, attendees: true },
            where: { id: scheduleEntryId },
        });

        if (
            scheduleEntry === null ||
            scheduleEntry.kind !== ScheduleEntryKind.Participant ||
            scheduleEntry.timeMode !== ScheduleEntryTimeMode.Timed ||
            scheduleEntry.maxAttendees === null ||
            scheduleEntry.participant === null ||
            !['Confirmed', 'Canceled'].includes(scheduleEntry.participant.status)
        ) {
            return { errorCode: unavailableRegistrationErrorCode };
        }

        if (scheduleEntry.attendees.some((attendee) => attendee.fullName === fullName && attendee.mailAddress === mailAddress)) {
            return { errorCode: duplicateRegistrationErrorCode };
        }

        if (scheduleEntry.attendees.length >= scheduleEntry.maxAttendees) {
            return { errorCode: fullRegistrationErrorCode };
        }

        await prismaClient.attendee.create({ data: { scheduleEntryId, fullName, mailAddress, attendedAt: new Date() } });

        if (isNotEmptyNumber(scheduleEntry.maxAttendees)) {
            sendSlotAttendConfirmationMail(scheduleEntry.participant, scheduleEntry, scheduleEntry.programLocation, fullName, mailAddress);
        }

        revalidateProgramPaths();

        return null;
    },
    (scheduleEntryId) => ({ targetType: 'ScheduleEntry', targetId: scheduleEntryId }),
);
