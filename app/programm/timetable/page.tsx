import Badge from '@/components/participants/details/Badge';
import formatDate from '@/lib/common/helper/formatDate';
import prismaClient from '@/lib/common/prismaClient';
import isGroupMember from '@/lib/next-auth/isGroupMember';
import isLoggedIn from '@/lib/next-auth/isLoggedIn';
import { dataPrivacyGroup } from '@/lib/next-auth/KeycloakGroups';
import getAllAttendees from '@/lib/participants/getAllAttendees';
import getAllParticipants from '@/lib/participants/getAllParticipants';
import getAllSlots from '@/lib/participants/getAllSlots';
import getAllVenues from '@/lib/participants/getAllVenues';
import serializeParticipant from '@/lib/participants/serializeParticipant';
import typeColors from '@/lib/participants/typeColors';
import typeLabels from '@/lib/participants/typeLabels';
import { cn } from '@/lib/utils';
import type AllAttendees from '@/typings/AllAttendees';
import type { SerializableParticipant } from '@/typings/SerializableParticipant';
import type { SerializableSlot } from '@/typings/SerializableSlot';
import type { Location, ParticipantLabel, Link as PrismaLink, Type, Venue } from '@prisma/client';
import { addHours, addMinutes, differenceInMinutes, isAfter, isBefore, isEqual, startOfHour, subHours } from 'date-fns';
import { clone } from 'lodash';
import { redirect } from 'next/navigation';
import { ReactElement } from 'react';

export interface TimetableEvent {
    id: number;
    name: string;
    location: Location;
    startTime: Date;
    endTime: Date;
    durationInMinutes: number;
    type: Type;
    genres: Array<string>;
}

interface Props {
    participants: Array<SerializableParticipant>;
    slots: Array<SerializableSlot>;
    venues: Array<Venue>;
    participantLabels: Array<ParticipantLabel>;
    allLinks: Array<PrismaLink>;
    allLocations: Array<Location>;
    allAttendees: Array<AllAttendees>;
}

async function getData(): Promise<Props> {
    const isInDataPrivacyGroup = await isGroupMember(dataPrivacyGroup);

    const participants = (await getAllParticipants(isInDataPrivacyGroup)).filter(({ status }) =>
        ['Confirmed', 'Canceled'].includes(status),
    );

    const slots = await getAllSlots();

    const venues = await getAllVenues();

    const sortedParticipant = participants.sort((participantA, participantB) => {
        const firstSlotA = slots.find(({ participantId }) => participantId === participantA.id);
        const firstSlotB = slots.find(({ participantId }) => participantId === participantB.id);

        if (firstSlotA === undefined && firstSlotB === undefined) {
            return 0;
        }

        if (firstSlotA === undefined) {
            return 1;
        }

        if (firstSlotB === undefined) {
            return -1;
        }

        const firstSlotABegin = new Date(firstSlotA.begin);
        const firstSlotBBegin = new Date(firstSlotB.begin);

        if (isEqual(firstSlotABegin, firstSlotBBegin)) {
            return 0;
        }

        return isAfter(firstSlotABegin, firstSlotBBegin) ? 1 : -1;
    });

    const participantLabels = await prismaClient.participantLabel.findMany();

    const allLinks = await prismaClient.link.findMany();

    const allLocations = await prismaClient.location.findMany({ orderBy: { name: 'asc' } });

    const allAttendees = await getAllAttendees();

    return {
        participants: sortedParticipant.map(serializeParticipant),
        slots,
        venues,
        participantLabels,
        allLinks,
        allLocations,
        allAttendees,
    };
}

export default async (): Promise<ReactElement> => {
    const loggedIn = await isLoggedIn();

    if (!loggedIn) {
        redirect('/');
    }

    const { participants, slots, allLocations } = await getData();

    const participantGenres = await prismaClient.participantGenre.findMany();

    const allGenres = await prismaClient.genre.findMany();

    const myLocationsMap = new Map<number, Location>();

    let earliestStart = new Date('2025-12-31');
    let latestEnd = new Date('2025-01-01');

    const events = slots.map<TimetableEvent>((slot) => {
        const startTime = new Date(slot.begin);
        const endTime = addMinutes(startTime, slot.duration);

        const participant = participants.find((p) => p.id === slot.participantId)!;

        const slotLocation = allLocations.find((lo) => lo.id === slot.locationId)!;

        myLocationsMap.set(slot.locationId, slotLocation);

        if (isBefore(startTime, earliestStart)) {
            earliestStart = startTime;
        }

        if (isAfter(endTime, latestEnd)) {
            latestEnd = endTime;
        }

        return {
            id: slot.id,
            name: participant.name,
            type: participant.type,
            genres: participantGenres
                .filter((dd) => dd.participantId === participant.id)
                .map((pg) => allGenres.find((g) => g.id === pg.genreId)!.name),
            startTime,
            endTime: addMinutes(startTime, slot.duration),
            durationInMinutes: slot.duration,
            location: slotLocation,
        };
    });

    earliestStart = startOfHour(subHours(earliestStart, 1));
    latestEnd = startOfHour(addHours(latestEnd, 2));

    let currentMinuteDate = clone(earliestStart);
    const minutes = new Array<Date>();

    while (isBefore(currentMinuteDate, latestEnd)) {
        minutes.push(clone(currentMinuteDate));
        currentMinuteDate = addMinutes(currentMinuteDate, 1);
    }
    minutes.push(clone(currentMinuteDate));

    return (
        <div className="fixed inset-0 w-full max-w-none bg-[#eaebeb]">
            <div className="h-[10vh]" />

            <div className="relative h-[90vh] overflow-x-auto overflow-y-visible">
                <div
                    className="relative grid gap-x-2 gap-y-[1px] pb-8"
                    style={{
                        gridTemplateColumns: `55px repeat(${myLocationsMap.size + 2}, 200px)`,
                        gridTemplateRows: `30px repeat(${differenceInMinutes(latestEnd, earliestStart)}, 2px)`,
                    }}
                >
                    {minutes.map((minute, minuteIndex) => {
                        const time = formatDate(minute, 'HH:mm');

                        if (!time.endsWith('00') && !time.endsWith('30')) {
                            return null;
                        }

                        return (
                            <div
                                key={formatDate(minute, 'dd.MM.HH:mm')}
                                className="sticky left-0 z-30 col-start-1 truncate overflow-visible text-xs text-black"
                                style={{ gridRowStart: minuteIndex + 2 }}
                            >
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-xl border border-black bg-gray-200 px-2 pt-1 font-display leading-4 text-gray-800">
                                    {time === '00:00' || minuteIndex === 0 ? (
                                        <div className="font-bold">{formatDate(minute, 'dd.MM.')}</div>
                                    ) : (
                                        <div className={cn(time.endsWith('30') && 'text-gray-500')}>{time}</div>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {Array.from(myLocationsMap).map(([locationId, location], locationIndex) => {
                        return (
                            <div
                                key={locationId}
                                className="sticky top-0 z-40 row-start-1 rounded-xl border border-black bg-[#ebc9de] px-3 pt-[3px] font-mono whitespace-nowrap"
                                style={{ gridColumnStart: locationIndex + 2 }}
                            >
                                {location.name}
                            </div>
                        );
                    })}

                    {events.map((event) => {
                        const locationIndex = Array.from(myLocationsMap.values()).findIndex(({ id }) => id === event.location.id);

                        const gridRowStart = differenceInMinutes(event.startTime, earliestStart);
                        const gridRowEnd = gridRowStart + event.durationInMinutes;
                        const gridColumnStart = locationIndex + 2;

                        return (
                            <div
                                key={event.id}
                                className="relative rounded-xl border border-black p-3 font-display text-[12px]"
                                style={{ gridColumnStart, gridRowStart, gridRowEnd, backgroundColor: typeColors[event.type] }}
                            >
                                <div className="sticky top-10 space-y-2 text-sm">
                                    <div className="text-base font-bold">{event.name}</div>

                                    <div>{typeLabels[event.type]}</div>

                                    <div>
                                        {event.genres.map((genreName) => (
                                            <Badge key={genreName} label={genreName} backgroundColor="#fcb8b8" />
                                        ))}
                                    </div>

                                    <div>
                                        {formatDate(event.startTime, 'HH:mm')} - {formatDate(event.endTime, 'HH:mm')} Uhr
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
