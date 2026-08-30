import WorkshopAttendeePrintButton from '@/components/participants/attendeeForm/WorkshopAttendeePrintButton';
import formatDate from '@/lib/common/helper/formatDate';
import prismaClient from '@/lib/common/prismaClient';
import isLoggedIn from '@/lib/next-auth/isLoggedIn';
import { ApplicationStatus, Type } from '@prisma/client';
import { notFound, redirect } from 'next/navigation';
import type { ReactElement } from 'react';

interface Props {
    params: Promise<{ id: string; scheduleEntryId: string }>;
}

const WorkshopAttendeePrintPage = async ({ params }: Props): Promise<ReactElement> => {
    if (!(await isLoggedIn())) {
        redirect('/');
    }

    const { id, scheduleEntryId } = await params;
    const participantId = Number(id);
    const entryId = Number(scheduleEntryId);

    if (!Number.isInteger(participantId) || !Number.isInteger(entryId) || participantId < 1 || entryId < 1) {
        notFound();
    }

    const scheduleEntry = await prismaClient.scheduleEntry.findFirst({
        include: {
            attendees: { orderBy: { fullName: 'asc' }, where: { confirmedAt: { not: null } } },
            participant: true,
            programLocation: true,
        },
        where: { id: entryId, participantId },
    });

    if (
        scheduleEntry === null ||
        scheduleEntry.participant === null ||
        scheduleEntry.participant.type !== Type.Workshop ||
        scheduleEntry.participant.status !== ApplicationStatus.Confirmed ||
        scheduleEntry.startsAt === null
    ) {
        notFound();
    }

    return (
        <main className="workshop-attendee-print mx-auto w-full max-w-3xl bg-white px-6 py-10 text-black print:max-w-none print:px-0 print:py-0">
            <div className="mb-8 print:hidden">
                <WorkshopAttendeePrintButton />
            </div>
            <h1 className="font-display text-4xl font-black">{scheduleEntry.participant.name}</h1>
            <div className="mt-5 border-y-2 border-black py-4 text-lg">
                <div>{formatDate(scheduleEntry.startsAt, "EEEE, dd.MM.yyyy '·' HH:mm 'Uhr'")}</div>
                <div>{scheduleEntry.programLocation.name}</div>
            </div>
            <h2 className="mt-8 font-display text-2xl font-black">Teilnehmende ({scheduleEntry.attendees.length})</h2>
            {scheduleEntry.attendees.length === 0 ? (
                <p className="mt-4">Bisher gibt es keine bestätigten Teilnahmen.</p>
            ) : (
                <ol className="mt-5 space-y-3 text-lg">
                    {scheduleEntry.attendees.map((attendee) => (
                        <li key={attendee.id} className="border-b border-black/30 pb-2">
                            {attendee.fullName}
                        </li>
                    ))}
                </ol>
            )}
        </main>
    );
};

export default WorkshopAttendeePrintPage;
