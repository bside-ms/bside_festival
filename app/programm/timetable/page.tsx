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

    console.log('minutes', minutes);

    type MySlot = { location: number; start: number; duration: number; name: string };

    const mySlots = new Array<MySlot>({ duration: 40, start: 200, location: 2, name: 'foo' });

    const mySlotMap = new Map<string, MySlot>();

    mySlots.forEach((s) => {
        mySlotMap.set(`${s.location}-${s.start}`, s);
    });

    return (
        <div className="fixed inset-0 w-full max-w-none bg-white">
            <div className="h-[10vh]" />

            <div className="relative h-[90vh] overflow-x-auto overflow-y-visible">
                <div
                    className="relative grid gap-x-2 gap-y-[1px]"
                    style={{
                        gridTemplateColumns: `40px repeat(${myLocationsMap.size + 2}, 80px)`,
                        gridTemplateRows: `30px repeat(${2000}, 2px)`, // TODO: amount of minutes
                    }}
                >
                    {minutes.map((minute, minuteIndex) => {
                        const time = formatDate(minute, 'HH:mm');

                        if (!time.endsWith('00') && !time.endsWith('30')) {
                            return null;
                        }

                        return (
                            <div
                                // eslint-disable-next-line react/no-array-index-key
                                key={formatDate(currentMinuteDate, 'dd.MM.HH:mm') + minuteIndex}
                                className="sticky left-0 col-start-1 truncate overflow-visible text-xs text-black"
                                style={{ gridRowStart: minuteIndex + 2 }}
                                data-date={formatDate(minute, 'dd.MM.')}
                                data-time={time}
                            >
                                {time === '00:00' || minuteIndex === 0 ? (
                                    <div className="absolute bottom-0 font-bold">{formatDate(minute, 'dd.MM.')}</div>
                                ) : (
                                    <div className={cn('absolute bottom-0', time.endsWith('30') && 'text-gray-400')}>{time}</div>
                                )}
                            </div>
                        );
                    })}

                    {Array.from(myLocationsMap).map(([locationId, location], locationIndex) => {
                        return (
                            <div
                                key={locationId}
                                className="sticky top-0 row-start-1 truncate bg-blue-700 text-xs whitespace-nowrap text-white"
                                style={{ gridColumnStart: locationIndex + 2 }}
                            >
                                {location.name}
                            </div>
                        );
                    })}

                    {events.splice(0, 20).map((event) => {
                        const locationIndex = Array.from(myLocationsMap.values()).findIndex(({ id }) => id === event.location.id);

                        const gridRowStart = differenceInMinutes(event.startTime, earliestStart);
                        const gridRowEnd = gridRowStart + event.durationInMinutes;
                        const gridColumnStart = locationIndex + 2;

                        return (
                            <div key={event.id} className="bg-yellow-300 text-[12px]" style={{ gridColumnStart, gridRowStart, gridRowEnd }}>
                                {event.name}, {formatDate(event.startTime, 'HH:mm')} - {formatDate(event.endTime, 'HH:mm')}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
