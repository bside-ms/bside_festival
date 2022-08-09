import { differenceInMinutes } from 'date-fns';
import type { ReactElement } from 'react';
import TimeTableFullTimeProgramItems from 'components/program/timeTable/TimeTableFullTimeProgramItems';
import TimeTableLocation from 'components/program/timeTable/TimeTableLocation';
import TimeTableLocationHeadline from 'components/program/timeTable/TimeTableLocationHeadline';
import type Concert from 'lib/strapi/typings/Concert';
import type Exhibition from 'lib/strapi/typings/Exhibition';
import type FamilyProgram from 'lib/strapi/typings/FamilyProgram';
import type Food from 'lib/strapi/typings/Food';
import type InformationBooth from 'lib/strapi/typings/InformationBooth';
import type Location from 'lib/strapi/typings/Location';
import type LocationGroup from 'lib/strapi/typings/LocationGroup';
import type Performance from 'lib/strapi/typings/Performance';
import type ProgramDate from 'lib/strapi/typings/ProgramDate';
import type Reading from 'lib/strapi/typings/Reading';
import type Workshop from 'lib/strapi/typings/Workshop';
import useOptimizedTimeTableBegin from 'lib/strapi/useOptimizedTimeTableBegin';
import useOptimizedTimeTableEnd from 'lib/strapi/useOptimizedTimeTableEnd';
import useScaledTimeTableMinutes from 'lib/strapi/useScaledTimeTableMinutes';
import useTimeTableHours from 'lib/strapi/useTimeTableHours';

interface Props {
    locations: Array<Location>;
    locationGroups: Array<LocationGroup>;
    date: ProgramDate;
    concerts: Array<Concert>;
    workshops: Array<Workshop>;
    performances: Array<Performance>;
    readings: Array<Reading>;
    familyPrograms: Array<FamilyProgram>;
    exhibitions: Array<Exhibition>;
    foods: Array<Food>;
    informationBooths: Array<InformationBooth>;
}

const TimeTableLocations = ({
    locations,
    locationGroups,
    date,
    concerts,
    workshops,
    performances,
    readings,
    familyPrograms,
    exhibitions,
    foods,
    informationBooths,
}: Props): ReactElement => {

    const allMinutesOfOneDay = 60 * 24;
    const fullHeight = useScaledTimeTableMinutes(allMinutesOfOneDay);

    const [begin, end] = date;

    const allTimeTableItems = [...concerts, ...workshops, ...performances, ...readings, ...familyPrograms];

    const optimizedTimeTableBegin = useOptimizedTimeTableBegin(begin, allTimeTableItems);
    const optimizedTimeTableEnd = useOptimizedTimeTableEnd(end, allTimeTableItems);

    const diffTimeTableBeginToStartOfDay = useScaledTimeTableMinutes(differenceInMinutes(optimizedTimeTableBegin, begin));
    const diffTimeTableEndToEndOfDay = useScaledTimeTableMinutes(differenceInMinutes(end, optimizedTimeTableEnd));

    const usedHeight = fullHeight - diffTimeTableBeginToStartOfDay - diffTimeTableEndToEndOfDay;

    const timeTableHours = useTimeTableHours(optimizedTimeTableBegin, optimizedTimeTableEnd);

    return (
        <div className="mb-20 -ml-5 pl-10 pr-5 pb-3 overflow-x-auto">
            <div className="flex gap-[1px]">
                {locations.map(location => (
                    <TimeTableLocationHeadline
                        key={location.id}
                        location={location}
                        locationGroups={locationGroups}
                    />
                ))}
            </div>
            <div className="flex gap-[1px]">
                {locations.map(location => (
                    <TimeTableFullTimeProgramItems
                        key={location.id}
                        location={location}
                        exhibitions={exhibitions}
                        foods={foods}
                        informationBooths={informationBooths}
                    />
                ))}
            </div>
            <div className="flex gap-[1px] bg-gray-300">
                {locations.map((location, index) => (
                    <TimeTableLocation
                        date={[begin, end]}
                        usedHeight={usedHeight}
                        optimizedTimeTableBegin={optimizedTimeTableBegin}
                        optimizedTimeTableEnd={optimizedTimeTableEnd}
                        timeTableHours={timeTableHours}
                        key={location.id}
                        location={location}
                        concerts={concerts}
                        workshops={workshops}
                        familyPrograms={familyPrograms}
                        performances={performances}
                        readings={readings}
                        isFirstLocation={index === 0}
                    />
                ))}
            </div>
        </div>
    );
};

export default TimeTableLocations;
