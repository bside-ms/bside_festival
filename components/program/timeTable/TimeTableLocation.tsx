import { differenceInMinutes, endOfDay, format } from 'date-fns';
import type { ReactElement } from 'react';
import TimeTableConcert from 'components/program/timeTable/TimeTableConcert';
import TimeTableHourDelimiter from 'components/program/timeTable/TimeTableHourDelimiter';
import TimeTablePerformance from 'components/program/timeTable/TimeTablePerformance';
import TimeTableReading from 'components/program/timeTable/TimeTableReading';
import TimeTableWorkshop from 'components/program/timeTable/TimeTableWorkshop';
import type Concert from 'lib/strapi/typings/Concert';
import type Location from 'lib/strapi/typings/Location';
import type Performance from 'lib/strapi/typings/Performance';
import type Reading from 'lib/strapi/typings/Reading';
import type Workshop from 'lib/strapi/typings/Workshop';
import useConcertsFilteredByLocationId from 'lib/strapi/useConcertsFilteredByLocationId';
import useOptimizedTimeTableBegin from 'lib/strapi/useOptimizedTimeTableBegin';
import useOptimizedTimeTableEnd from 'lib/strapi/useOptimizedTimeTableEnd';
import useProgramItemFilteredByLocationId from 'lib/strapi/useProgramItemFilteredByLocationId';
import useScaledTimeTableMinutes from 'lib/strapi/useScaledTimeTableMinutes';
import useTimeTableHours from 'lib/strapi/useTimeTableHours';

interface Props {
    date: Date;
    location: Location;
    concerts: Array<Concert>;
    workshops: Array<Workshop>;
    performances: Array<Performance>;
    readings: Array<Reading>;
    isFirstLocation: boolean;
}

const TimeTableLocation = ({ date, location, concerts, workshops, performances, readings, isFirstLocation }: Props): ReactElement => {

    const allMinutesOfDay = 60 * 24;
    const fullHeight = useScaledTimeTableMinutes(allMinutesOfDay);

    const optimizedTimeTableBegin = useOptimizedTimeTableBegin(date, [...concerts, ...workshops, ...performances, ...readings]);
    const optimizedTimeTableEnd = useOptimizedTimeTableEnd(date, [...concerts, ...workshops, ...performances, ...readings]);

    const diffTimeTableBeginToStartOfDay = useScaledTimeTableMinutes(differenceInMinutes(optimizedTimeTableBegin, date));
    const diffTimeTableEndToEndOfDay = useScaledTimeTableMinutes(differenceInMinutes(endOfDay(date), optimizedTimeTableEnd));

    const usedHeight = fullHeight - diffTimeTableBeginToStartOfDay - diffTimeTableEndToEndOfDay;

    const concertsFilteredByLocation = useConcertsFilteredByLocationId(concerts, location.id);
    const workshopsFilteredByLocation = useProgramItemFilteredByLocationId(workshops, location.id);
    const performancesFilteredByLocation = useProgramItemFilteredByLocationId(performances, location.id);
    const readingsFilteredByLocation = useProgramItemFilteredByLocationId(readings, location.id);

    const timeTableHours = useTimeTableHours(optimizedTimeTableBegin, optimizedTimeTableEnd);

    return (
        <div className="w-[200px] shrink-0">
            <div
                className="bg-gray-200 drop-shadow-md rounded relative"
                style={{ height: `${usedHeight}px` }}
            >
                {timeTableHours.map(timeTableHour => (
                    <TimeTableHourDelimiter
                        key={format(timeTableHour, 'HH')}
                        optimizedTimeTableBegin={optimizedTimeTableBegin}
                        hour={timeTableHour}
                        withHourText={isFirstLocation}
                    />
                ))}
                {concertsFilteredByLocation.map(concert => (
                    <TimeTableConcert
                        key={concert.id}
                        optimizedTimeTableBegin={optimizedTimeTableBegin}
                        optimizedTimeTableEnd={optimizedTimeTableEnd}
                        concert={concert}
                    />
                ))}
                {workshopsFilteredByLocation.map(workshop => (
                    <TimeTableWorkshop
                        key={workshop.id}
                        optimizedTimeTableBegin={optimizedTimeTableBegin}
                        optimizedTimeTableEnd={optimizedTimeTableEnd}
                        workshop={workshop}
                    />
                ))}
                {performancesFilteredByLocation.map(performance => (
                    <TimeTablePerformance
                        key={performance.id}
                        optimizedTimeTableBegin={optimizedTimeTableBegin}
                        optimizedTimeTableEnd={optimizedTimeTableEnd}
                        performance={performance}
                    />
                ))}
                {readingsFilteredByLocation.map(reading => (
                    <TimeTableReading
                        key={reading.id}
                        optimizedTimeTableBegin={optimizedTimeTableBegin}
                        optimizedTimeTableEnd={optimizedTimeTableEnd}
                        reading={reading}
                    />
                ))}
            </div>
        </div>
    );
};

export default TimeTableLocation;
