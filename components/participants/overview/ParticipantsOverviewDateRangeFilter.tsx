import { useParticipantsOverviewContext } from '@/components/participants/overview/ParticipantsOverviewContext';
import { Slider } from '@/components/ui/slider';
import { dateRangeFilterQueryName } from '@/lib/applications/filterQueryNames';
import formatDate from '@/lib/common/helper/formatDate';
import useIsMounted from '@/lib/common/hooks/useIsMounted';
import { addHours, isBefore, isSameMinute } from 'date-fns';
import { clone } from 'lodash';
import type { ReactElement } from 'react';
import { useCallback, useEffect } from 'react';

const halfHourInMilliseconds = 1000 * 60 * 30;

const ParticipantsOverviewDateRangeFilter = (): ReactElement | null => {
    const { slotsDateRange, filteredDateRange, setFilteredDateRange } = useParticipantsOverviewContext();

    const isMounted = useIsMounted();

    useEffect(() => {
        if (!isMounted) {
            return;
        }

        const currentUrl = new URL(window.location.href);

        if (filteredDateRange === null) {
            currentUrl.searchParams.delete(dateRangeFilterQueryName);
        } else {
            const [begin, end] = filteredDateRange;
            currentUrl.searchParams.set(dateRangeFilterQueryName, `${begin},${end}`);
        }

        history.replaceState(null, '', currentUrl.toString());
    }, [isMounted, filteredDateRange]);

    const handleChange = useCallback(
        ([begin, end]: [number, number]) => {
            if (begin === end) {
                setFilteredDateRange([begin, end + halfHourInMilliseconds * 2]);
            } else if (
                slotsDateRange !== null &&
                isSameMinute(new Date(begin), slotsDateRange[0]) &&
                isSameMinute(new Date(end), slotsDateRange[1])
            ) {
                setFilteredDateRange(null);
            } else {
                setFilteredDateRange([begin, end]);
            }
        },
        [setFilteredDateRange, slotsDateRange],
    );

    if (slotsDateRange === null) {
        return null;
    }

    const earliestTimestamp = Number(formatDate(slotsDateRange[0], 'T'));
    const latestTimestamp = Number(formatDate(slotsDateRange[1], 'T'));

    const dateOptions = new Array<Date>();
    let currentDate = slotsDateRange[0];

    do {
        dateOptions.push(clone(currentDate));
        currentDate = addHours(currentDate, 1);
    } while (isBefore(currentDate, slotsDateRange[1]));

    return (
        <div className="mb-9">
            <div className="mb-3 flex max-w-lg flex-col flex-wrap gap-4">
                <div className="flex justify-between">
                    {filteredDateRange !== null ? (
                        <>
                            <div>{formatDate(filteredDateRange[0], 'EEE dd.MM. / HH:mm')}</div>
                            <div>{formatDate(filteredDateRange[1], 'EEE dd.MM. / HH:mm')}</div>
                        </>
                    ) : (
                        <>
                            <div>{formatDate(slotsDateRange[0], 'EEE dd.MM. / HH:mm')}</div>
                            <div>{formatDate(slotsDateRange[1], 'EEE dd.MM. / HH:mm')}</div>
                        </>
                    )}
                </div>

                <div>
                    <Slider
                        value={filteredDateRange === null ? undefined : [filteredDateRange[0], filteredDateRange[1]]}
                        className="h-3 w-full rounded-lg bg-gray-200"
                        min={earliestTimestamp}
                        max={latestTimestamp}
                        defaultValue={[earliestTimestamp, latestTimestamp]}
                        step={halfHourInMilliseconds}
                        onValueChange={handleChange}
                    />
                </div>
            </div>
        </div>
    );
};

export default ParticipantsOverviewDateRangeFilter;
