'use server';

import { requireLoggedInUser } from '@/lib/actions/actionAuth';
import { revalidateProgramPaths } from '@/lib/actions/actionRevalidation';
import prismaClient from '@/lib/common/prismaClient';
import { loggedAction } from '@/lib/errorLog/loggedAction';
import { recordActionError } from '@/lib/errorLog/recordActionError';
import sendWorkshopAttendanceCancellationMail from '@/lib/mail/sendWorkshopAttendanceCancellationMail';
import sendWorkshopAttendanceConfirmationMail from '@/lib/mail/sendWorkshopAttendanceConfirmationMail';
import sendWorkshopAttendanceVerificationMail from '@/lib/mail/sendWorkshopAttendanceVerificationMail';
import { workshopAttendeeRegistrationSchema, type WorkshopAttendeeRegistrationValues } from '@/lib/schemas/workshopAttendeeSchema';
import { activeWorkshopReservationWhere, workshopReservationTtlMs } from '@/lib/workshops/workshopAttendeeReservations';
import { ApplicationStatus, type Attendee, type Participant, Prisma, ScheduleEntryKind, ScheduleEntryTimeMode, Type } from '@prisma/client';

type WorkshopRegistrationResult = { status: 'reserved' } | { status: 'duplicate' } | { status: 'full' } | { status: 'unavailable' };

type WorkshopConfirmationResult = { success: true } | { success: false; message: string };

type WorkshopVerificationResult =
    | { available: true }
    | {
          available: false;
          message: string;
          wasConfirmed?: boolean;
          workshop?: { name: string; programLocationName: string; startsAt: Date | null };
      };

type ReservedWorkshopRegistration = {
    attendee: Attendee;
    participant: Participant;
    status: 'reserved';
    token: string;
};

type WorkshopRegistrationTransactionResult = Exclude<WorkshopRegistrationResult, { status: 'reserved' }> | ReservedWorkshopRegistration;

const deleteExpiredReservations = async (tx: Prisma.TransactionClient): Promise<void> => {
    await tx.attendee.deleteMany({
        where: {
            attendedAt: { lt: new Date(Date.now() - workshopReservationTtlMs) },
            confirmedAt: null,
        },
    });
};

const isWorkshopRegistrationAvailable = (
    scheduleEntry: {
        kind: ScheduleEntryKind;
        timeMode: ScheduleEntryTimeMode;
        maxAttendees: number | null;
        startsAt: Date | null;
        participant: { status: ApplicationStatus; type: Type } | null;
    } | null,
): scheduleEntry is NonNullable<typeof scheduleEntry> & {
    maxAttendees: number;
    startsAt: Date;
    participant: { status: ApplicationStatus; type: Type };
} =>
    scheduleEntry !== null &&
    scheduleEntry.kind === ScheduleEntryKind.Participant &&
    scheduleEntry.timeMode === ScheduleEntryTimeMode.Timed &&
    scheduleEntry.maxAttendees !== null &&
    scheduleEntry.startsAt !== null &&
    scheduleEntry.startsAt > new Date() &&
    scheduleEntry.participant?.status === ApplicationStatus.Confirmed &&
    scheduleEntry.participant.type === Type.Workshop;

const runSerializableTransaction = async <Result>(operation: (tx: Prisma.TransactionClient) => Promise<Result>): Promise<Result> => {
    for (let attempt = 0; attempt < 3; attempt += 1) {
        try {
            return await prismaClient.$transaction(operation, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
        } catch (error) {
            if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== 'P2034' || attempt === 2) {
                throw error;
            }
        }
    }

    throw new Error('Die Workshop-Anmeldung konnte nicht gespeichert werden.');
};

export const registerWorkshopAttendee = loggedAction(
    'registerWorkshopAttendee',
    async (data: WorkshopAttendeeRegistrationValues): Promise<WorkshopRegistrationResult> => {
        const values = workshopAttendeeRegistrationSchema.parse(data);
        const result: WorkshopRegistrationTransactionResult = await runSerializableTransaction(async (tx) => {
            await deleteExpiredReservations(tx);
            const scheduleEntry = await tx.scheduleEntry.findUnique({
                include: {
                    _count: { select: { attendees: { where: activeWorkshopReservationWhere() } } },
                    attendees: { where: activeWorkshopReservationWhere(), select: { fullName: true, mailAddress: true } },
                    participant: true,
                },
                where: { id: values.scheduleEntryId },
            });

            if (!isWorkshopRegistrationAvailable(scheduleEntry)) {
                return { status: 'unavailable' };
            }

            if (
                scheduleEntry.attendees.some(
                    (attendee) =>
                        attendee.fullName.trim().toLocaleLowerCase() === values.fullName.toLocaleLowerCase() &&
                        attendee.mailAddress.trim().toLocaleLowerCase() === values.mailAddress,
                )
            ) {
                return { status: 'duplicate' };
            }

            if (scheduleEntry._count.attendees >= scheduleEntry.maxAttendees) {
                return { status: 'full' };
            }

            const attendee = await tx.attendee.create({
                data: {
                    attendedAt: new Date(),
                    fullName: values.fullName,
                    mailAddress: values.mailAddress,
                    message: values.message === undefined || values.message === '' ? null : values.message,
                    scheduleEntryId: scheduleEntry.id,
                },
            });
            const token = crypto.randomUUID();

            await tx.attendeeEmailVerificationToken.create({
                data: {
                    attendeeId: attendee.id,
                    expires: new Date(Date.now() + workshopReservationTtlMs),
                    token,
                },
            });

            return { status: 'reserved', attendee, participant: scheduleEntry.participant, token };
        });

        if (result.status === 'reserved') {
            try {
                await sendWorkshopAttendanceVerificationMail(result.attendee, result.participant, result.token);
            } catch (error) {
                await recordActionError({
                    source: 'sendWorkshopAttendanceVerificationMail',
                    error,
                    targetType: 'ScheduleEntry',
                    targetId: values.scheduleEntryId,
                    context: { mailAddress: result.attendee.mailAddress },
                });
            }
            revalidateProgramPaths();
        }

        return result.status === 'reserved' ? { status: 'reserved' } : result;
    },
    (data) => ({ targetType: 'ScheduleEntry', targetId: data.scheduleEntryId, context: { mailAddress: data.mailAddress } }),
);

export const confirmWorkshopAttendee = async (token: string): Promise<WorkshopConfirmationResult> => {
    try {
        const result = await runSerializableTransaction(async (tx) => {
            await deleteExpiredReservations(tx);
            const verification = await tx.attendeeEmailVerificationToken.findUnique({
                include: { attendee: { include: { scheduleEntry: { include: { participant: true, programLocation: true } } } } },
                where: { token },
            });

            if (verification === null) {
                return { success: false, message: 'Dieser Bestätigungslink ist ungültig oder bereits verwendet.' } as const;
            }

            if (verification.confirmedAt !== null) {
                return { alreadyConfirmed: true, success: true } as const;
            }

            if (verification.expires < new Date()) {
                await tx.attendee.delete({ where: { id: verification.attendeeId } });
                return { success: false, message: 'Diese Reservierung ist abgelaufen. Der Platz wurde wieder freigegeben.' } as const;
            }

            const { attendee } = verification;
            const { scheduleEntry } = attendee;

            if (!isWorkshopRegistrationAvailable(scheduleEntry)) {
                await tx.attendee.delete({ where: { id: attendee.id } });
                return { success: false, message: 'Dieser Workshop ist leider nicht mehr für Anmeldungen verfügbar.' } as const;
            }

            const cancellationToken = crypto.randomUUID();
            const confirmedAt = new Date();
            const confirmedAttendee = await tx.attendee.update({
                data: {
                    confirmedAt,
                    cancellationToken: { create: { token: cancellationToken } },
                },
                where: { id: attendee.id },
            });
            await tx.attendeeEmailVerificationToken.update({ data: { confirmedAt }, where: { id: verification.id } });

            return {
                success: true,
                attendee: confirmedAttendee,
                cancellationToken,
                participant: scheduleEntry.participant,
                programLocation: scheduleEntry.programLocation,
                scheduleEntry,
            } as const;
        });

        if (!result.success) {
            return result;
        }

        if (result.alreadyConfirmed) {
            return { success: true };
        }

        try {
            await sendWorkshopAttendanceConfirmationMail(
                result.attendee,
                result.participant,
                result.scheduleEntry,
                result.programLocation,
                result.cancellationToken,
            );
        } catch (error) {
            await recordActionError({
                source: 'sendWorkshopAttendanceConfirmationMail',
                error,
                targetType: 'ScheduleEntry',
                targetId: result.scheduleEntry.id,
                context: { mailAddress: result.attendee.mailAddress },
            });
        }
        revalidateProgramPaths();

        return { success: true };
    } catch (error) {
        await recordActionError({ source: 'confirmWorkshopAttendee', error, context: { hasToken: Boolean(token) } });
        return { success: false, message: 'Die Teilnahme konnte nicht bestätigt werden.' };
    }
};

export const getWorkshopAttendeeVerification = async (token: string): Promise<WorkshopVerificationResult> => {
    const verification = await prismaClient.attendeeEmailVerificationToken.findUnique({
        include: {
            attendee: {
                include: { scheduleEntry: { include: { participant: true, programLocation: true } } },
            },
        },
        where: { token },
    });

    if (verification === null) {
        return { available: false, message: 'Dieser Bestätigungslink ist ungültig oder bereits verwendet.' };
    }

    if (verification.confirmedAt !== null) {
        const { scheduleEntry } = verification.attendee;

        return {
            available: false,
            message: 'Deine Workshop-Teilnahme ist bereits bestätigt.',
            wasConfirmed: true,
            ...(scheduleEntry.participant === null
                ? {}
                : {
                      workshop: {
                          name: scheduleEntry.participant.name,
                          programLocationName: scheduleEntry.programLocation.name,
                          startsAt: scheduleEntry.startsAt,
                      },
                  }),
        };
    }

    if (verification.expires < new Date()) {
        return { available: false, message: 'Diese Reservierung ist abgelaufen. Der Platz wurde wieder freigegeben.' };
    }

    return { available: true };
};

export const getWorkshopAttendeeCancellation = async (
    token: string,
): Promise<
    { available: true; attendeeName: string; participantName: string } | { available: false; message: string; wasCancelled?: boolean }
> => {
    const cancellation = await prismaClient.attendeeCancellationToken.findUnique({
        include: { attendee: { include: { scheduleEntry: { include: { participant: true } } } } },
        where: { token },
    });

    if (cancellation === null) {
        return { available: false, message: 'Dieser Abmeldelink ist ungültig oder wurde bereits verwendet.' };
    }

    if (cancellation.canceledAt !== null) {
        return { available: false, message: 'Deine Teilnahme wurde abgemeldet. Der Platz ist wieder frei.', wasCancelled: true };
    }

    if (cancellation.attendee === null || cancellation.attendee.scheduleEntry.participant === null) {
        return { available: false, message: 'Dieser Abmeldelink ist ungültig oder wurde bereits verwendet.' };
    }

    if (cancellation.attendee.scheduleEntry.startsAt === null || cancellation.attendee.scheduleEntry.startsAt <= new Date()) {
        return { available: false, message: 'Dieser Workshop hat bereits begonnen; eine Abmeldung ist nicht mehr möglich.' };
    }

    return {
        available: true,
        attendeeName: cancellation.attendee.fullName,
        participantName: cancellation.attendee.scheduleEntry.participant.name,
    };
};

export const cancelWorkshopAttendee = loggedAction(
    'cancelWorkshopAttendee',
    async (token: string): Promise<WorkshopConfirmationResult> => {
        const cancellation = await runSerializableTransaction(async (tx) => {
            const record = await tx.attendeeCancellationToken.findUnique({
                include: { attendee: { include: { scheduleEntry: { include: { participant: true } } } } },
                where: { token },
            });

            if (
                record === null ||
                record.canceledAt !== null ||
                record.attendee === null ||
                record.attendee.scheduleEntry.participant === null ||
                record.attendee.scheduleEntry.startsAt === null ||
                record.attendee.scheduleEntry.startsAt <= new Date()
            ) {
                return null;
            }

            await tx.attendeeCancellationToken.update({ data: { canceledAt: new Date() }, where: { id: record.id } });
            await tx.attendee.delete({ where: { id: record.attendee.id } });
            return { attendee: record.attendee, participant: record.attendee.scheduleEntry.participant };
        });

        if (cancellation === null) {
            return { success: false, message: 'Diese Abmeldung ist nicht mehr möglich.' };
        }

        try {
            await sendWorkshopAttendanceCancellationMail(cancellation.attendee, cancellation.participant);
        } catch (error) {
            await recordActionError({
                source: 'sendWorkshopAttendanceCancellationMail',
                error,
                targetType: 'ScheduleEntry',
                targetId: cancellation.attendee.scheduleEntryId,
                context: { mailAddress: cancellation.attendee.mailAddress },
            });
        }
        revalidateProgramPaths();

        return { success: true };
    },
    () => ({}),
);

export const removeWorkshopAttendee = loggedAction(
    'removeWorkshopAttendee',
    async (attendeeId: number): Promise<void> => {
        await requireLoggedInUser();
        const registration = await prismaClient.attendee.findUniqueOrThrow({
            include: { scheduleEntry: { include: { participant: true } } },
            where: { id: attendeeId },
        });

        if (registration.scheduleEntry.participant === null) {
            throw new Error('Die Workshop-Anmeldung ist nicht mehr verfügbar.');
        }

        await prismaClient.attendeeCancellationToken.updateMany({
            data: { canceledAt: new Date() },
            where: { attendeeId },
        });
        await prismaClient.attendee.delete({ where: { id: attendeeId } });

        if (registration.confirmedAt !== null) {
            try {
                await sendWorkshopAttendanceCancellationMail(registration, registration.scheduleEntry.participant);
            } catch (error) {
                await recordActionError({
                    source: 'sendWorkshopAttendanceCancellationMail',
                    error,
                    targetType: 'ScheduleEntry',
                    targetId: registration.scheduleEntryId,
                    context: { mailAddress: registration.mailAddress },
                });
            }
        }
        revalidateProgramPaths();
    },
    () => ({}),
);
