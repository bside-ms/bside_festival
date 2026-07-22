'use client';

import availableTypes from '@/lib/applications/availableTypes';
import { pinnedParticipantsCookieName, readCookie, setCookie } from '@/lib/applications/cookies';
import formatDate from '@/lib/common/helper/formatDate';
import isEmptyString from '@/lib/common/helper/isEmptyString';
import useEffectOnMount from '@/lib/common/hooks/useEffectOnMount';
import isValidType from '@/lib/participants/isValidType';
import AllAttendees from '@/typings/AllAttendees';
import type { SerializableParticipant } from '@/typings/SerializableParticipant';
import type { SerializableProgramLocation } from '@/typings/SerializableProgramLocation';
import type { SerializableScheduleEntry } from '@/typings/SerializableScheduleEntry';
import {
    ScheduleEntryTimeMode,
    type Attendee,
    type Genre,
    type Link,
    type ParticipantGenre,
    type ParticipantLabel,
    type Type,
} from '@prisma/client';
import { addHours, endOfHour, isAfter, isBefore, isSameMinute, startOfHour, subHours } from 'date-fns';
import Fuse from 'fuse.js';
import { first, last, uniq, xor } from 'lodash';
import { createContext, PropsWithChildren, ReactElement, useCallback, useContext, useMemo, useState } from 'react';

interface ParticipantsOverviewContextData {
    allParticipants: Array<SerializableParticipant>;
    scheduleEntries: Array<SerializableScheduleEntry>;
    programLocations: Array<SerializableProgramLocation>;
    filteredParticipants: Array<SerializableParticipant>;
    participantLabels: Array<ParticipantLabel>;
    pinnedParticipantIds: Array<number>;
    togglePinnedParticipantId: (id: number) => void;
    getLinksOfParticipant: (id: number) => Array<Link>;
    actuallyAvailableTypes: Array<Type>;
    filteredText: string | null;
    setFilteredText: (text: string | null) => void;
    filteredTypes: Array<Type>;
    toggleFilteredType: (type: Type) => void;
    filteredLocationIds: Array<number>;
    toggleFilteredLocationId: (locationId: number) => void;
    filteredDateRange: [number, number] | null;
    setFilteredDateRange: (dateRange: [number, number] | null) => void;
    allAttendees: Array<AllAttendees>;
    scheduleEntriesDateRange: [Date, Date] | null;
    areLocationOrDateRangeFiltersSet: boolean;
    areFiltersSet: boolean;
    isInDataPrivacyGroup: boolean;
    participantGenres: Array<ParticipantGenre>;
    allGenres: Array<Genre & { count: 0 }>;
}

const ParticipantsOverviewContext = createContext<ParticipantsOverviewContextData | null>(null);

interface Props extends PropsWithChildren {
    participants: Array<SerializableParticipant>;
    scheduleEntries: Array<SerializableScheduleEntry>;
    allAttendees: Array<AllAttendees>;
    participantLabels: Array<ParticipantLabel>;
    allLinks: Array<Link>;
    programLocations: Array<SerializableProgramLocation>;
    isInDataPrivacyGroup: boolean;
    initialDateRangeDateRangeFilter: string | undefined;
    initialTypesFilter: string | undefined;
    initialLocationsFilter: string | undefined;
    initialTextFilter: string | undefined;
    participantGenres: Array<ParticipantGenre>;
    allGenres: Array<Genre>;
}

export const ParticipantsOverviewContextProvider = ({
    participants,
    participantLabels,
    allLinks,
    scheduleEntries,
    allAttendees,
    programLocations,
    isInDataPrivacyGroup,
    initialDateRangeDateRangeFilter,
    initialTypesFilter,
    initialLocationsFilter,
    initialTextFilter,
    participantGenres,
    allGenres,
    children,
}: Props): ReactElement => {
    const [filteredTypes, setFilteredTypes] = useState<Array<Type>>((initialTypesFilter?.split(',') ?? []).filter(isValidType));

    const [filteredText, setFilteredText] = useState<string | null>(initialTextFilter ?? null);

    const [filteredLocationIds, setFilteredLocationIds] = useState<Array<number>>((initialLocationsFilter?.split(',') ?? []).map(Number));

    const timedEntries = scheduleEntries.filter(
        (entry) => entry.timeMode === ScheduleEntryTimeMode.Timed && entry.startsAt !== null && entry.endsAt !== null,
    );
    const earliestTimedEntry = first(timedEntries);
    const latestTimedEntry = last(timedEntries);
    const timeBufferInHours = 2;
    const earliestBegin =
        earliestTimedEntry === undefined ? null : startOfHour(subHours(new Date(earliestTimedEntry.startsAt!), timeBufferInHours));
    const latestBegin =
        latestTimedEntry === undefined
            ? null
            : startOfHour(addHours(endOfHour(addHours(new Date(latestTimedEntry.endsAt!), timeBufferInHours)), 1));

    const initialDateRange = initialDateRangeDateRangeFilter?.split(',') ?? [];
    let initialDateRangeValue: [number, number] | null = null;
    if (initialDateRange.length === 2 && !isNaN(Number(initialDateRange[0])) && !isNaN(Number(initialDateRange[1]))) {
        initialDateRangeValue = [Number(initialDateRange[0]), Number(initialDateRange[1])];
    } else if (earliestBegin !== null && latestBegin !== null && isAfter(new Date(), earliestBegin) && isBefore(new Date(), latestBegin)) {
        const aboutOneHourAgo = startOfHour(subHours(new Date(), 1));
        initialDateRangeValue = [Number(formatDate(aboutOneHourAgo, 'T')), Number(formatDate(latestBegin, 'T'))];
    }
    const [filteredDateRange, setFilteredDateRange] = useState<[number, number] | null>(initialDateRangeValue);

    const [pinnedParticipantIds, setPinnedParticipantIds] = useState<Array<number>>([]);

    const togglePinnedParticipantId = useCallback((participantId: number) => {
        setPinnedParticipantIds((prevPinnedParticipantIds) => {
            const newPinnedParticipantIds = xor(prevPinnedParticipantIds, [participantId]);
            setCookie(pinnedParticipantsCookieName, newPinnedParticipantIds.join(','));
            return newPinnedParticipantIds;
        });
    }, []);

    useEffectOnMount(() => {
        setPinnedParticipantIds(readCookie(pinnedParticipantsCookieName)?.split(',').map(Number) ?? []);
    });

    const filteredParticipants = useMemo<Array<SerializableParticipant>>(() => {
        const participantsFilteredByType = participants.filter(
            (application) => filteredTypes.length === 0 || filteredTypes.includes(application.type),
        );

        if (isEmptyString(filteredText)) {
            return participantsFilteredByType;
        }

        const fuse = new Fuse(participantsFilteredByType, {
            keys: ['name'],
            shouldSort: true,
            includeScore: true,
            includeMatches: true,
            isCaseSensitive: false,
            findAllMatches: true,
        });

        return fuse.search(filteredText).map((result) => result.item);
    }, [filteredText, participants, filteredTypes.length]);

    const toggleFilteredType = useCallback((type: Type) => {
        setFilteredTypes((types) => xor(types, [type]));
    }, []);

    const toggleFilteredLocationId = useCallback((locationId: number) => {
        setFilteredLocationIds((locationIds) => xor(locationIds, [locationId]));
    }, []);

    const getLinksOfParticipant = useCallback((id: number) => allLinks.filter(({ participantId }) => participantId === id), [allLinks]);

    const typesOfParticipants = uniq(participants.map(({ type }) => type));

    const actuallyAvailableTypes = availableTypes.filter((type) => typesOfParticipants.includes(type));

    return (
        <ParticipantsOverviewContext.Provider
            value={{
                allParticipants: participants,
                participantLabels,
                filteredParticipants,
                getLinksOfParticipant,
                actuallyAvailableTypes,
                filteredTypes,
                toggleFilteredType,
                filteredLocationIds,
                toggleFilteredLocationId,
                filteredDateRange,
                setFilteredDateRange,
                scheduleEntries: scheduleEntries.filter((entry) => {
                    if (filteredLocationIds.length > 0 && !filteredLocationIds.includes(entry.programLocationId)) {
                        return false;
                    }

                    if (filteredDateRange === null) {
                        return true;
                    }

                    if (entry.timeMode !== ScheduleEntryTimeMode.Timed || entry.startsAt === null) {
                        return false;
                    }

                    const entryBegin = new Date(entry.startsAt);

                    const filteredBegin = new Date(filteredDateRange[0]);
                    const filteredEnd = new Date(filteredDateRange[1]);

                    return (
                        (isSameMinute(entryBegin, filteredBegin) || isAfter(entryBegin, filteredBegin)) &&
                        (isSameMinute(entryBegin, filteredEnd) || isBefore(entryBegin, filteredEnd))
                    );
                }),
                programLocations,
                allAttendees,
                scheduleEntriesDateRange: earliestBegin === null || latestBegin === null ? null : [earliestBegin, latestBegin],
                areLocationOrDateRangeFiltersSet: filteredLocationIds.length > 0 || filteredDateRange !== null,
                pinnedParticipantIds,
                togglePinnedParticipantId,
                areFiltersSet: filteredDateRange !== null || filteredTypes.length > 0 || filteredLocationIds.length > 0,
                isInDataPrivacyGroup,
                participantGenres,
                allGenres: allGenres.map((genre) => ({ ...genre, count: 0 })),
                filteredText,
                setFilteredText,
            }}
        >
            {children}
        </ParticipantsOverviewContext.Provider>
    );
};

export const useParticipantsOverviewContext = (): ParticipantsOverviewContextData => {
    const participantsOverviewContext = useContext(ParticipantsOverviewContext);

    if (participantsOverviewContext === null) {
        throw new Error('useParticipantsOverviewContext must only be used within corresponding provider!');
    }

    return participantsOverviewContext;
};

export interface ParticipantSlot {
    scheduleEntry: SerializableScheduleEntry;
    programLocation: SerializableProgramLocation;
}

interface ParticipantAllDayEntry {
    scheduleEntry: SerializableScheduleEntry;
    programLocation: SerializableProgramLocation;
    dates: Array<Date>;
}

export const useScheduleEntryAttendees = (scheduleEntryId: number): Array<Omit<Attendee, 'attendedAt'>> => {
    const { allAttendees } = useParticipantsOverviewContext();

    return allAttendees.find((scheduleEntry) => scheduleEntry.scheduleEntryId === scheduleEntryId)?.attendees ?? [];
};

export const useParticipantSlots = (participantId: number): Array<ParticipantSlot> => {
    const { programLocations, scheduleEntries } = useParticipantsOverviewContext();

    return scheduleEntries
        .filter((entry) => entry.participantId === participantId && entry.timeMode === ScheduleEntryTimeMode.Timed)
        .map<ParticipantSlot | null>((slotItem) => {
            const programLocation = programLocations.find((locationItem) => locationItem.id === slotItem.programLocationId);

            if (programLocation === undefined) {
                return null;
            }

            return {
                scheduleEntry: slotItem,
                programLocation,
            };
        })
        .filter((slotItem): slotItem is ParticipantSlot => slotItem !== null);
};

export const useParticipantVenues = (participantId: number): Array<ParticipantAllDayEntry> => {
    const { programLocations, scheduleEntries } = useParticipantsOverviewContext();

    return scheduleEntries
        .filter((entry) => entry.participantId === participantId && entry.timeMode === ScheduleEntryTimeMode.AllDay)
        .map<ParticipantAllDayEntry | null>((venueItem) => {
            const programLocation = programLocations.find((locationItem) => locationItem.id === venueItem.programLocationId);

            if (programLocation === undefined) {
                return null;
            }

            return {
                scheduleEntry: venueItem,
                programLocation,
                dates: venueItem.allDayDates
                    .filter((date) => /\d{4}-\d{2}-\d{2}/.test(date))
                    .map((date) => new Date(`${date}T12:00:00+02:00`)),
            };
        })
        .filter((venueItem): venueItem is ParticipantAllDayEntry => venueItem !== null);
};
