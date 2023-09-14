import { useCallback, useEffect } from 'react';
import { addHours, isBefore, isSameMinute } from 'date-fns';
import { clone } from 'lodash';
import type { ReactElement } from 'react';
import ReactSlider from 'react-slider';
import { useParticipantsOverviewContext } from 'components/participants/overview/ParticipantsOverviewContext';
import formatDate from 'lib/common/helper/formatDate';
import useIsMounted from 'lib/common/hooks/useIsMounted';

export const dateRangeFilterQueryName = 'date-range';

const halfHourInMilliseconds = 1000 * 60 * 30;

const ParticipantsOverviewLDateRangeFilter = (): ReactElement | null => {
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
            <div className="flex flex-col flex-wrap gap-4 mb-3 max-w-lg">
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
                    <ReactSlider
                        value={filteredDateRange === null ? undefined : [filteredDateRange[0], filteredDateRange[1]]}
                        className="w-full h-3 bg-gray-200 rounded-lg"
                        min={earliestTimestamp}
                        max={latestTimestamp}
                        defaultValue={[earliestTimestamp, latestTimestamp]}
                        step={halfHourInMilliseconds}
                        pearling={true}
                        onChange={handleChange}
                        // eslint-disable-next-line react/jsx-no-bind
                        renderTrack={(props, state): ReactElement => {
                            if (state.index === 1) {
                                return <div {...props} className="bg-gray-500 rounded-lg h-3" />;
                            }

                            return <div {...props} />;
                        }}
                        // eslint-disable-next-line react/jsx-no-bind
                        renderThumb={(props): ReactElement => (
                            <div
                                {...props}
                                className="border-gray-600 border-2 bg-gray-200 select-none ring-0 h-8 w-8 rounded-full top-1/2 -translate-y-1/2"
                            />
                        )}
                    />
                </div>
            </div>
        </div>
    );
};

export default ParticipantsOverviewLDateRangeFilter;
