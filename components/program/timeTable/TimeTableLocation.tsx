import { differenceInMinutes, endOfDay, format } from 'date-fns';
import type { ReactElement } from 'react';
import TimeTableConcert from 'components/program/timeTable/TimeTableConcert';
import TimeTableHourDelimiter from 'components/program/timeTable/TimeTableHourDelimiter';
import TimeTableWorkshop from 'components/program/timeTable/TimeTableWorkshop';
import type Concert from 'lib/strapi/Concert';
import type Location from 'lib/strapi/Location';
import useConcertsFilteredByLocationId from 'lib/strapi/useConcertsFilteredByLocationId';
import useOptimizedTimeTableBegin from 'lib/strapi/useOptimizedTimeTableBegin';
import useOptimizedTimeTableEnd from 'lib/strapi/useOptimizedTimeTableEnd';
import useScaledTimeTableMinutes from 'lib/strapi/useScaledTimeTableMinutes';
import useTimeTableHours from 'lib/strapi/useTimeTableHours';
import useWorkshopsFilteredByLocationId from 'lib/strapi/useWorkshopsFilteredByLocationId';
import type Workshop from 'lib/strapi/Workshop';

interface Props {
    date: Date;
    location: Location;
    concerts: Array<Concert>;
    workshops: Array<Workshop>;
    isFirstLocation: boolean;
}

const TimeTableLocation = ({ date, location, concerts, workshops, isFirstLocation }: Props): ReactElement => {

    const allMinutesOfDay = 60 * 24;
    const fullHeight = useScaledTimeTableMinutes(allMinutesOfDay);

    const optimizedTimeTableBegin = useOptimizedTimeTableBegin(date, [...concerts, ...workshops]);
    const optimizedTimeTableEnd = useOptimizedTimeTableEnd(date, [...concerts, ...workshops]);

    const diffTimeTableBeginToStartOfDay = useScaledTimeTableMinutes(differenceInMinutes(optimizedTimeTableBegin, date));
    const diffTimeTableEndToEndOfDay = useScaledTimeTableMinutes(differenceInMinutes(endOfDay(date), optimizedTimeTableEnd));

    const usedHeight = fullHeight - diffTimeTableBeginToStartOfDay - diffTimeTableEndToEndOfDay;

    const concertsFilteredByLocation = useConcertsFilteredByLocationId(concerts, location.id);
    const workshopsFilteredByLocation = useWorkshopsFilteredByLocationId(workshops, location.id);

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
            </div>
        </div>
    );
};

export default TimeTableLocation;
