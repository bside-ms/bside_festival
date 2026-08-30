import AttendeeForm from '@/components/participants/attendeeForm/AttendeeForm';
import WorkshopAttendeeList from '@/components/participants/attendeeForm/WorkshopAttendeeList';
import ProgramBackLink from '@/components/participants/publicProgram/ProgramBackLink';
import PublicProgramLinks from '@/components/participants/publicProgram/PublicProgramLinks';
import formatDate from '@/lib/common/helper/formatDate';
import prismaClient from '@/lib/common/prismaClient';
import isGroupMember from '@/lib/next-auth/isGroupMember';
import isLoggedIn from '@/lib/next-auth/isLoggedIn';
import { dataPrivacyGroup } from '@/lib/next-auth/KeycloakGroups';
import isProgramPublished from '@/lib/participants/isProgramPublished';
import { getPublicProgramSection } from '@/lib/participants/publicProgramSections';
import typeLabels from '@/lib/participants/typeLabels';
import createPublicObjectUrl from '@/lib/upload/createPublicObjectUrl';
import { activeWorkshopReservationWhere } from '@/lib/workshops/workshopAttendeeReservations';
import { ApplicationStatus, ScheduleEntryTimeMode, Type } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import type { ReactElement } from 'react';

interface Props {
    params: Promise<{ id: string }>;
}

const formatAllDayDate = (date: string): string => formatDate(new Date(`${date}T12:00:00+02:00`), 'EEEE, dd. MMMM');

const ProgramEntryPage = async ({ params }: Props): Promise<ReactElement> => {
    const loggedIn = await isLoggedIn();
    const isInDataPrivacyGroup = loggedIn && (await isGroupMember(dataPrivacyGroup));

    if (!isProgramPublished && !loggedIn) {
        redirect('/');
    }

    const id = Number((await params).id);

    if (!Number.isInteger(id) || id < 1) {
        notFound();
    }

    const participant = await prismaClient.participant.findFirst({
        where: { id, status: { in: [ApplicationStatus.Confirmed, ApplicationStatus.Canceled] } },
        include: {
            genres: { include: { genre: true }, orderBy: { genre: { name: 'asc' } } },
            links: { where: { isConfidential: false }, orderBy: { id: 'asc' } },
            scheduleEntries: {
                include: {
                    attendees: {
                        orderBy: { attendedAt: 'asc' },
                        select: { confirmedAt: true, fullName: true, id: true, mailAddress: true },
                        where: activeWorkshopReservationWhere(),
                    },
                    programLocation: true,
                },
                orderBy: [{ startsAt: 'asc' }, { id: 'asc' }],
            },
        },
    });

    if (participant === null) {
        notFound();
    }

    const section = getPublicProgramSection(participant.type);
    const imageUrl =
        participant.imageFileName === null || participant.imageFileName === '' ? null : createPublicObjectUrl(participant.imageFileName);

    return (
        <article className="min-h-screen font-display" style={{ backgroundColor: section.color, color: section.foregroundColor }}>
            <div className="mx-auto w-full max-w-6xl px-6 py-10 md:px-10 md:py-16">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <ProgramBackLink />
                    {loggedIn && (
                        <Link
                            href={`/intern/${participant.id}`}
                            className="inline-flex bg-[#2C2E83] px-4 py-2 font-bold text-white no-underline transition hover:bg-black focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-current"
                        >
                            intern bearbeiten →
                        </Link>
                    )}
                </div>

                {participant.status === ApplicationStatus.Canceled && (
                    <div className="mt-8 bg-[#2C2E83] px-5 py-4 text-lg font-black text-white">Fällt leider aus</div>
                )}

                <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(20rem,0.9fr)] lg:items-start">
                    <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-[#2C2E83] lg:min-h-140">
                        {imageUrl === null ? (
                            <div className="absolute inset-0 bg-[#2C2E83]" />
                        ) : (
                            <Image
                                src={imageUrl}
                                alt={participant.name}
                                fill
                                className="object-cover"
                                sizes="(max-width: 1023px) 100vw, 55vw"
                                priority
                            />
                        )}
                    </div>

                    <div>
                        <div className="inline-flex bg-[#2C2E83] px-3 py-1 text-sm font-black text-white">
                            {typeLabels[participant.type]}
                        </div>
                        {participant.genres.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                                {participant.genres.map(({ genre }) => (
                                    <div key={genre.id} className="border border-current px-3 py-1 text-sm font-bold">
                                        {genre.name}
                                    </div>
                                ))}
                            </div>
                        )}
                        <h1 className="mt-5 text-5xl leading-[0.9] font-black sm:text-6xl md:text-7xl">{participant.name}</h1>
                        {participant.description !== null && participant.description !== '' && (
                            <p className="mt-6 text-base leading-relaxed font-medium whitespace-pre-line md:text-lg">
                                {participant.description}
                            </p>
                        )}
                    </div>
                </div>

                <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(20rem,0.9fr)]">
                    <section className="bg-white p-6 text-[#2C2E83] md:p-8" aria-labelledby="program-appearances-title">
                        <h2 id="program-appearances-title" className="text-2xl font-black">
                            Wann &amp; Wo
                        </h2>
                        {participant.scheduleEntries.length === 0 ? (
                            <p className="mt-4 font-medium">Die genauen Zeiten und Orte folgen in Kürze.</p>
                        ) : (
                            <ul className="mt-5 space-y-4">
                                {participant.scheduleEntries.map((entry) => {
                                    const dates =
                                        entry.timeMode === ScheduleEntryTimeMode.Timed && entry.startsAt !== null
                                            ? [formatDate(entry.startsAt, 'EEEE, dd. MMMM · HH:mm')]
                                            : Array.isArray(entry.allDayDates)
                                              ? entry.allDayDates
                                                    .filter((date): date is string => typeof date === 'string')
                                                    .map(formatAllDayDate)
                                              : [];

                                    return (
                                        <li key={entry.id} className="border-l-4 border-[#EA504C] pl-4">
                                            <div className="font-black">{entry.programLocation.name}</div>
                                            <div className="mt-1 font-medium">{dates.join(' · ')}</div>
                                            {participant.type === Type.Workshop &&
                                                participant.status === ApplicationStatus.Confirmed &&
                                                entry.timeMode === ScheduleEntryTimeMode.Timed &&
                                                entry.maxAttendees !== null && (
                                                    <div className="mt-5">
                                                        <AttendeeForm
                                                            scheduleEntryId={entry.id}
                                                            maxAttendees={entry.maxAttendees}
                                                            availableAttendees={Math.max(entry.maxAttendees - entry.attendees.length, 0)}
                                                        />
                                                    </div>
                                                )}
                                            {loggedIn && participant.type === Type.Workshop && entry.maxAttendees !== null && (
                                                <WorkshopAttendeeList
                                                    attendees={entry.attendees
                                                        .filter((attendee) => attendee.confirmedAt !== null)
                                                        .map((attendee) => ({
                                                            confirmedAt: attendee.confirmedAt?.toISOString() ?? null,
                                                            fullName: attendee.fullName,
                                                            id: attendee.id,
                                                            ...(isInDataPrivacyGroup ? { mailAddress: attendee.mailAddress } : {}),
                                                        }))}
                                                    isInDataPrivacyGroup={isInDataPrivacyGroup}
                                                    participantId={participant.id}
                                                    scheduleEntryId={entry.id}
                                                />
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </section>

                    <div className="self-start bg-white p-6 text-[#2C2E83] md:p-8">
                        <PublicProgramLinks links={participant.links} />
                    </div>
                </div>
            </div>
        </article>
    );
};

export default ProgramEntryPage;
