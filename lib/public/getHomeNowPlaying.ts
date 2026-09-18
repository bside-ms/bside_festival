import formatDate from '@/lib/common/helper/formatDate';
import prismaClient from '@/lib/common/prismaClient';
import isProgramPublished from '@/lib/participants/isProgramPublished';
import publicProgramSections from '@/lib/participants/publicProgramSections';
import typeLabels from '@/lib/participants/typeLabels';
import { ApplicationStatus, ScheduleEntryKind, ScheduleEntryTimeMode, type Type } from '@prisma/client';
import { compact, filter, map, orderBy, take } from 'lodash';

const homeNowPlayingUpcomingLimit = 5;

type NowPlayingAppearance = {
    id: number;
    locationName: string;
    name: string;
    participantId: number;
    typeLabel: string;
    when: string;
};

export type NowPlayingSection = {
    appearances: Array<NowPlayingAppearance>;
    color: string;
    id: string;
    label: string;
};

export type NowPlayingData = {
    now: Array<NowPlayingSection>;
    upcoming: Array<NowPlayingSection>;
};

type TimedAppearance = {
    endsAt: Date;
    id: number;
    locationName: string;
    name: string;
    participantId: number;
    startsAt: Date;
    type: Type;
};

const sectionIndex = (type: Type): number => publicProgramSections.findIndex(({ types }) => types.includes(type));

const formatAppearanceWhen = (startsAt: Date, endsAt: Date, now: Date): string => {
    const range = `${formatDate(startsAt, 'HH:mm')}–${formatDate(endsAt, 'HH:mm')}`;

    if (formatDate(startsAt, 'yyyy-MM-dd') === formatDate(now, 'yyyy-MM-dd')) {
        return range;
    }

    return `${formatDate(startsAt, 'EEEE')}, ${range}`;
};

const toAppearance = (appearance: TimedAppearance, now: Date): NowPlayingAppearance => ({
    id: appearance.id,
    locationName: appearance.locationName,
    name: appearance.name,
    participantId: appearance.participantId,
    typeLabel: typeLabels[appearance.type],
    when: formatAppearanceWhen(appearance.startsAt, appearance.endsAt, now),
});

const groupByProgramSection = (appearances: Array<TimedAppearance>, now: Date): Array<NowPlayingSection> =>
    compact(
        map(publicProgramSections, (section) => {
            const sectionAppearances = orderBy(
                filter(appearances, (appearance) => section.types.includes(appearance.type)),
                [(appearance) => appearance.startsAt.getTime(), (appearance) => appearance.name.toLocaleLowerCase('de-DE'), 'id'],
            );

            if (sectionAppearances.length === 0) {
                return null;
            }

            return {
                appearances: map(sectionAppearances, (appearance) => toAppearance(appearance, now)),
                color: section.color,
                id: section.id,
                label: section.label,
            };
        }),
    );

const getHomeNowPlaying = async (now = new Date()): Promise<NowPlayingData | null> => {
    if (!isProgramPublished) {
        return null;
    }

    const scheduleEntries = await prismaClient.scheduleEntry.findMany({
        select: {
            endsAt: true,
            id: true,
            participant: { select: { id: true, name: true, type: true } },
            programLocation: { select: { name: true } },
            startsAt: true,
        },
        where: {
            endsAt: { not: null },
            kind: ScheduleEntryKind.Participant,
            participant: { status: ApplicationStatus.Confirmed },
            participantId: { not: null },
            startsAt: { not: null },
            timeMode: ScheduleEntryTimeMode.Timed,
        },
    });

    const timed = compact(
        map(scheduleEntries, (entry): TimedAppearance | null => {
            if (entry.participant === null || entry.startsAt === null || entry.endsAt === null) {
                return null;
            }

            return {
                endsAt: entry.endsAt,
                id: entry.id,
                locationName: entry.programLocation.name,
                name: entry.participant.name,
                participantId: entry.participant.id,
                startsAt: entry.startsAt,
                type: entry.participant.type,
            };
        }),
    );

    const nowAppearances = filter(timed, (appearance) => appearance.startsAt <= now && now < appearance.endsAt);
    const upcomingAppearances = take(
        orderBy(
            filter(timed, (appearance) => appearance.startsAt > now),
            [
                (appearance) => appearance.startsAt.getTime(),
                (appearance) => sectionIndex(appearance.type),
                (appearance) => appearance.name.toLocaleLowerCase('de-DE'),
                'id',
            ],
        ),
        homeNowPlayingUpcomingLimit,
    );

    if (nowAppearances.length === 0 && upcomingAppearances.length === 0) {
        return null;
    }

    return {
        now: groupByProgramSection(nowAppearances, now),
        upcoming: groupByProgramSection(upcomingAppearances, now),
    };
};

export default getHomeNowPlaying;
