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
    const { scheduleEntriesDateRange, filteredDateRange, setFilteredDateRange } = useParticipantsOverviewContext();

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
                scheduleEntriesDateRange !== null &&
                isSameMinute(new Date(begin), scheduleEntriesDateRange[0]) &&
                isSameMinute(new Date(end), scheduleEntriesDateRange[1])
            ) {
                setFilteredDateRange(null);
            } else {
                setFilteredDateRange([begin, end]);
            }
        },
        [setFilteredDateRange, scheduleEntriesDateRange],
    );

    if (scheduleEntriesDateRange === null) {
        return null;
    }

    const earliestTimestamp = Number(formatDate(scheduleEntriesDateRange[0], 'T'));
    const latestTimestamp = Number(formatDate(scheduleEntriesDateRange[1], 'T'));

    const dateOptions = new Array<Date>();
    let currentDate = scheduleEntriesDateRange[0];

    do {
        dateOptions.push(clone(currentDate));
        currentDate = addHours(currentDate, 1);
    } while (isBefore(currentDate, scheduleEntriesDateRange[1]));

    return (
        <div className="mb-4 rounded-2xl border border-black bg-[#b1c32c]">
            <div className="border-b border-black p-2 text-center text-2xl uppercase">Zeitraum</div>

            <div className="px-2 py-4">
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
    );
};

export default ParticipantsOverviewDateRangeFilter;
