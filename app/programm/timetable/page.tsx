import formatDate from '@/lib/common/helper/formatDate';
import isLoggedIn from '@/lib/next-auth/isLoggedIn';
import getAllParticipants from '@/lib/participants/getAllParticipants';
import serializeParticipant from '@/lib/participants/serializeParticipant';
import typeColors from '@/lib/participants/typeColors';
import typeLabels from '@/lib/participants/typeLabels';
import getAllProgramLocations from '@/lib/schedule/getAllProgramLocations';
import getAllScheduleEntries from '@/lib/schedule/getAllScheduleEntries';
import { cn } from '@/lib/utils';
import type { SerializableParticipant } from '@/typings/SerializableParticipant';
import type { SerializableProgramLocation } from '@/typings/SerializableProgramLocation';
import type { SerializableScheduleEntry } from '@/typings/SerializableScheduleEntry';
import { ScheduleEntryKind, ScheduleEntryTimeMode, type Type } from '@prisma/client';
import { addHours, addMinutes, differenceInMinutes, isAfter, isBefore, startOfHour, subHours } from 'date-fns';
import { clone } from 'lodash';
import { redirect } from 'next/navigation';
import { ReactElement } from 'react';

export interface TimetableEvent {
    id: number;
    name: string;
    location: SerializableProgramLocation;
    startTime: Date;
    endTime: Date;
    durationInMinutes: number;
    type: Type | null;
}

interface Props {
    participants: Array<SerializableParticipant>;
    scheduleEntries: Array<SerializableScheduleEntry>;
    programLocations: Array<SerializableProgramLocation>;
}

async function getData(): Promise<Props> {
    const participants = await getAllParticipants(true, false, ['Confirmed', 'Canceled']);
    const scheduleEntries = await getAllScheduleEntries({ publicOnly: true });
    const programLocations = await getAllProgramLocations(false);

    return {
        participants: participants.map(serializeParticipant),
        scheduleEntries,
        programLocations,
    };
}

export default async (): Promise<ReactElement> => {
    const loggedIn = await isLoggedIn();

    if (!loggedIn) {
        redirect('/');
    }

    const { participants, scheduleEntries, programLocations } = await getData();
    const myLocationsMap = new Map<number, SerializableProgramLocation>();

    let earliestStart = new Date('2025-12-31');
    let latestEnd = new Date('2025-01-01');

    const events = scheduleEntries
        .filter((entry) => entry.timeMode === ScheduleEntryTimeMode.Timed && entry.startsAt !== null && entry.endsAt !== null)
        .map<TimetableEvent | null>((entry) => {
            const startTime = new Date(entry.startsAt!);
            const endTime = new Date(entry.endsAt!);
            const participant = entry.participantId === null ? null : (participants.find((p) => p.id === entry.participantId) ?? null);
            const location = programLocations.find((programLocation) => programLocation.id === entry.programLocationId);

            if (location === undefined || (entry.kind === ScheduleEntryKind.Participant && participant === null)) {
                return null;
            }

            myLocationsMap.set(entry.programLocationId, location);

            if (isBefore(startTime, earliestStart)) {
                earliestStart = startTime;
            }

            if (isAfter(endTime, latestEnd)) {
                latestEnd = endTime;
            }

            return {
                id: entry.id,
                name: participant?.name ?? entry.title ?? 'Hinweis',
                type: participant?.type ?? null,
                startTime,
                endTime,
                durationInMinutes: differenceInMinutes(endTime, startTime),
                location,
            };
        })
        .filter((event): event is TimetableEvent => event !== null);

    if (events.length === 0) {
        earliestStart = new Date('2026-09-18T12:00:00+02:00');
        latestEnd = new Date('2026-09-18T14:00:00+02:00');
    }

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
                                style={{
                                    gridColumnStart,
                                    gridRowStart,
                                    gridRowEnd,
                                    backgroundColor: event.type === null ? '#e5e7eb' : typeColors[event.type],
                                }}
                            >
                                <div className="sticky top-10 space-y-2 text-sm">
                                    <div className="text-base font-bold">{event.name}</div>

                                    {event.type !== null && <div>{typeLabels[event.type]}</div>}

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
