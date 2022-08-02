import { format } from 'date-fns';
import type { ReactElement } from 'react';
import TimeTableHourDelimiter from 'components/program/timeTable/TimeTableHourDelimiter';
import TimeTableProgramItem from 'components/program/timeTable/TimeTableProgramItem';
import type Concert from 'lib/strapi/typings/Concert';
import type FamilyProgram from 'lib/strapi/typings/FamilyProgram';
import type Location from 'lib/strapi/typings/Location';
import type Performance from 'lib/strapi/typings/Performance';
import type ProgramDate from 'lib/strapi/typings/ProgramDate';
import type Reading from 'lib/strapi/typings/Reading';
import type Workshop from 'lib/strapi/typings/Workshop';
import useProgramItemFilteredByLocationId from 'lib/strapi/useProgramItemFilteredByLocationId';

interface Props {
    usedHeight: number;
    timeTableHours: Array<Date>;
    date: ProgramDate;
    location: Location;
    concerts: Array<Concert>;
    workshops: Array<Workshop>;
    performances: Array<Performance>;
    readings: Array<Reading>;
    familyPrograms: Array<FamilyProgram>;
    isFirstLocation: boolean;
    optimizedTimeTableBegin: Date;
    optimizedTimeTableEnd: Date;
}

const TimeTableLocation = ({
    timeTableHours,
    usedHeight,
    location,
    concerts,
    workshops,
    performances,
    readings,
    familyPrograms,
    optimizedTimeTableBegin,
    optimizedTimeTableEnd,
    isFirstLocation,
}: Props): ReactElement => {

    const concertsFilteredByLocation = useProgramItemFilteredByLocationId(concerts, location.id);
    const workshopsFilteredByLocation = useProgramItemFilteredByLocationId(workshops, location.id);
    const performancesFilteredByLocation = useProgramItemFilteredByLocationId(performances, location.id);
    const readingsFilteredByLocation = useProgramItemFilteredByLocationId(readings, location.id);
    const familyProgramsFilteredByLocation = useProgramItemFilteredByLocationId(familyPrograms, location.id);

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
                    <TimeTableProgramItem
                        key={concert.id}
                        optimizedTimeTableBegin={optimizedTimeTableBegin}
                        optimizedTimeTableEnd={optimizedTimeTableEnd}
                        programItem={concert}
                    />
                ))}
                {workshopsFilteredByLocation.map(workshop => (
                    <TimeTableProgramItem
                        key={workshop.id}
                        optimizedTimeTableBegin={optimizedTimeTableBegin}
                        optimizedTimeTableEnd={optimizedTimeTableEnd}
                        programItem={workshop}
                    />
                ))}
                {performancesFilteredByLocation.map(performance => (
                    <TimeTableProgramItem
                        key={performance.id}
                        optimizedTimeTableBegin={optimizedTimeTableBegin}
                        optimizedTimeTableEnd={optimizedTimeTableEnd}
                        programItem={performance}
                    />
                ))}
                {readingsFilteredByLocation.map(reading => (
                    <TimeTableProgramItem
                        key={reading.id}
                        optimizedTimeTableBegin={optimizedTimeTableBegin}
                        optimizedTimeTableEnd={optimizedTimeTableEnd}
                        programItem={reading}
                    />
                ))}
                {familyProgramsFilteredByLocation.map(familyProgram => (
                    <TimeTableProgramItem
                        key={familyProgram.id}
                        optimizedTimeTableBegin={optimizedTimeTableBegin}
                        optimizedTimeTableEnd={optimizedTimeTableEnd}
                        programItem={familyProgram}
                    />
                ))}
            </div>
        </div>
    );
};

export default TimeTableLocation;
