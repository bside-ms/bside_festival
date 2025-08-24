'use client';

import { useParticipantsOverviewContext } from '@/components/participants/overview/ParticipantsOverviewContext';
import { slotPlanDayFilterQueryName } from '@/lib/applications/filterQueryNames';
import formatDate from '@/lib/common/helper/formatDate';
import type { Location } from '@prisma/client';
import { addMinutes, differenceInMinutes, format } from 'date-fns';
import { ReactElement, useCallback, useEffect, useMemo } from 'react';

const PX_PER_MINUTE = 1.5;
const TIME_STEP_MINUTES = 30;
const HEADER_PX = 40;

const Slotplan = ({ initialDayFilter }: { initialDayFilter?: string }): ReactElement => {
    const { slots, allLocations, allParticipants, slotsDateRange, filteredDateRange, setFilteredDateRange } =
        useParticipantsOverviewContext();

    const baseYear = useMemo(
        () => (slotsDateRange !== null ? slotsDateRange[0].getFullYear() : new Date().getFullYear()),
        [slotsDateRange],
    );

    const fridayBoundaryStart = useMemo(() => new Date(`${baseYear}-09-19T04:00:00+02:00`), [baseYear]);
    const fridayBoundaryEnd = useMemo(() => new Date(`${baseYear}-09-20T04:00:00+02:00`), [baseYear]);
    const saturdayBoundaryStart = useMemo(() => new Date(`${baseYear}-09-20T04:00:00+02:00`), [baseYear]);
    const saturdayBoundaryEnd = useMemo(() => new Date(`${baseYear}-09-21T04:00:00+02:00`), [baseYear]);

    const computeDynamicStart = (dayStart: Date, dayEnd: Date): Date => {
        const earliestForDay = slots
            .map((s) => new Date(s.begin))
            .filter((d) => d >= dayStart && d < dayEnd)
            .sort((a, b) => a.getTime() - b.getTime())[0];
        if (!earliestForDay) {
            return dayStart;
        }
        const oneHourBefore = addMinutes(earliestForDay, -60);
        return oneHourBefore < dayStart ? dayStart : oneHourBefore;
    };

    const selectDay = useCallback(
        (day: 'friday' | 'saturday') => {
            const [dayStart, dayEnd] =
                day === 'friday' ? [fridayBoundaryStart, fridayBoundaryEnd] : [saturdayBoundaryStart, saturdayBoundaryEnd];
            const dynamicStart = computeDynamicStart(dayStart, dayEnd);
            const startTs = Number(formatDate(dynamicStart, 'T'));
            const endTs = Number(formatDate(dayEnd, 'T'));

            const currentUrl = new URL(window.location.href);
            currentUrl.searchParams.set(slotPlanDayFilterQueryName, day);
            history.replaceState(null, '', currentUrl.toString());

            setFilteredDateRange([startTs, endTs]);
        },
        [fridayBoundaryStart, fridayBoundaryEnd, saturdayBoundaryStart, saturdayBoundaryEnd, slots, setFilteredDateRange],
    );

    // Default to Friday range on first load if no range selected
    useEffect(() => {
        if (filteredDateRange === null) {
            if (initialDayFilter === 'friday' || initialDayFilter === 'saturday') {
                selectDay(initialDayFilter);
            }
        }
    }, [filteredDateRange, fridayBoundaryStart.getTime(), fridayBoundaryEnd.getTime(), slots.length]);

    const [rangeStart, rangeEnd] = useMemo(() => {
        if (filteredDateRange !== null) {
            return [new Date(filteredDateRange[0]), new Date(filteredDateRange[1])] as const;
        }
        if (slotsDateRange === null) {
            return [null, null] as const;
        }
        return [slotsDateRange[0], slotsDateRange[1]] as const;
    }, [filteredDateRange, slotsDateRange]);

    const minutesTotal = useMemo(() => {
        if (rangeStart === null || rangeEnd === null) {
            return 0;
        }
        return Math.max(0, differenceInMinutes(rangeEnd, rangeStart));
    }, [rangeStart, rangeEnd]);

    const heightPx = Math.max(0, minutesTotal * PX_PER_MINUTE);

    const locationsWithSlots = useMemo<Array<Location>>(() => {
        const locationIdsWithSlots = new Set(slots.map((s) => s.locationId));
        return allLocations.filter((l) => locationIdsWithSlots.has(l.id)).sort((a, b) => a.name.localeCompare(b.name));
    }, [allLocations, slots]);

    const timeTicks = useMemo(() => {
        if (rangeStart === null || rangeEnd === null) {
            return [] as Array<Date>;
        }
        const ticks: Array<Date> = [];
        const minutes = differenceInMinutes(rangeEnd, rangeStart);
        for (let m = 0; m <= minutes; m += TIME_STEP_MINUTES) {
            ticks.push(addMinutes(rangeStart, m));
        }
        return ticks;
    }, [rangeStart, rangeEnd]);

    const getTopPx = (beginIso: string): number => {
        if (rangeStart === null) {
            return 0;
        }
        const begin = new Date(beginIso);
        return differenceInMinutes(begin, rangeStart) * PX_PER_MINUTE;
    };

    const getHeightPx = (durationMinutes: number): number => Math.max(24, durationMinutes * PX_PER_MINUTE);

    const isFridaySelected = useMemo(() => {
        if (filteredDateRange === null) {
            return false;
        }
        const start = new Date(filteredDateRange[0]);
        return start.getFullYear() === baseYear && start.getMonth() === 8 && start.getDate() === 19; // September is month 8
    }, [filteredDateRange, baseYear]);

    const isSaturdaySelected = useMemo(() => {
        if (filteredDateRange === null) {
            return false;
        }
        const start = new Date(filteredDateRange[0]);
        return start.getFullYear() === baseYear && start.getMonth() === 8 && start.getDate() === 20;
    }, [filteredDateRange, baseYear]);

    const onFridayClick = useCallback(() => selectDay('friday'), [selectDay]);
    const onSaturdayClick = useCallback(() => selectDay('saturday'), [selectDay]);

    return (
        <div className="mt-6 overflow-x-auto">
            {/* Day toggle */}
            <div className="mb-4 flex items-center gap-2">
                <button
                    type="button"
                    className={
                        isFridaySelected
                            ? 'rounded-md bg-black px-3 py-1.5 text-white'
                            : 'rounded-md border border-gray-300 px-3 py-1.5 text-gray-800 hover:bg-gray-50'
                    }
                    onClick={onFridayClick}
                >
                    Freitag, 19.09.
                </button>
                <button
                    type="button"
                    className={
                        isSaturdaySelected
                            ? 'rounded-md bg-black px-3 py-1.5 text-white'
                            : 'rounded-md border border-gray-300 px-3 py-1.5 text-gray-800 hover:bg-gray-50'
                    }
                    onClick={onSaturdayClick}
                >
                    Samstag, 20.09.
                </button>
            </div>
            <div className="relative inline-block w-full">
                {/* Sticky header row for location names */}
                <div className="sticky top-0 z-30 flex bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60">
                    {/* Time gutter spacer */}
                    <div className="w-16 shrink-0 border-b border-gray-200" />
                    {locationsWithSlots.map((location) => (
                        <div key={location.id} className="min-w-56 shrink-0 grow border-b border-gray-200 px-2 py-2 text-sm font-medium">
                            {location.name}
                        </div>
                    ))}
                </div>
                <div className="flex">
                    {/* Time gutter with sticky header and ticks */}
                    <div className="sticky left-0 z-20 w-16 shrink-0 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60">
                        <div className="relative" style={{ height: `${heightPx + HEADER_PX}px` }}>
                            {timeTicks.map((tick) => {
                                const top = differenceInMinutes(tick, rangeStart ?? new Date()) * PX_PER_MINUTE + HEADER_PX;
                                return (
                                    <div
                                        key={tick.toISOString()}
                                        className="absolute flex -translate-y-1/2 items-center gap-1 text-[10px] text-gray-500"
                                        style={{ top }}
                                    >
                                        <span className="w-12 text-right tabular-nums">{format(tick, 'HH:mm')}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Columns per location */}
                    <div className="flex grow">
                        {locationsWithSlots.map((location) => (
                            <div key={location.id} className="relative min-w-56 shrink-0 grow border-l border-gray-100">
                                {/* Time grid lines */}
                                <div
                                    className="pointer-events-none absolute inset-x-0"
                                    style={{ top: 0, height: `${heightPx + HEADER_PX}px` }}
                                >
                                    {timeTicks.map((tick) => {
                                        const top = differenceInMinutes(tick, rangeStart ?? new Date()) * PX_PER_MINUTE + HEADER_PX;
                                        const isHour = tick.getMinutes() === 0;
                                        return (
                                            <div
                                                key={tick.toISOString()}
                                                className={isHour ? 'absolute h-px w-full bg-gray-300' : 'absolute h-px w-full bg-gray-100'}
                                                style={{ top }}
                                            />
                                        );
                                    })}
                                </div>

                                {/* Slots for this location */}
                                <div className="relative" style={{ height: `${heightPx + HEADER_PX}px` }}>
                                    {slots
                                        .filter((s) => s.locationId === location.id)
                                        .map((s) => {
                                            const participant = allParticipants.find((p) => p.id === s.participantId);
                                            const top = getTopPx(s.begin) + HEADER_PX;
                                            const height = getHeightPx(s.duration);
                                            return (
                                                <div
                                                    key={s.id}
                                                    className="absolute right-2 left-2 rounded-md border border-gray-300 bg-white p-2 shadow-sm"
                                                    style={{ top, height }}
                                                    title={participant?.name ?? 'Unbekannt'}
                                                >
                                                    <div className="line-clamp-2 text-xs leading-tight font-medium">
                                                        {participant?.name ?? 'Unbekannt'}
                                                    </div>
                                                    <div className="mt-1 text-[10px] text-gray-500">
                                                        {format(new Date(s.begin), 'HH:mm')} · {s.duration} Min
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Spacer to set overall height */}
                <div className="h-px" style={{ height: `${heightPx + HEADER_PX}px` }} />
            </div>
        </div>
    );
};

export default Slotplan;
