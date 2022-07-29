import { useState } from 'react';
import type { ReactElement } from 'react';
import TimeTableDateSelects from 'components/program/timeTable/TimeTableDateSelects';
import TimeTableLocation from 'components/program/timeTable/TimeTableLocation';
import TimeTableLocationHeadline from 'components/program/timeTable/TimeTableLocationHeadline';
import type Concert from 'lib/strapi/typings/Concert';
import type Performance from 'lib/strapi/typings/Performance';
import type Reading from 'lib/strapi/typings/Reading';
import type Workshop from 'lib/strapi/typings/Workshop';
import useAvailableDates from 'lib/strapi/useAvailableDates';
import useConcertsFilteredByDate from 'lib/strapi/useConcertsFilteredByDate';
import useLocationsFromTimeTableItems from 'lib/strapi/useLocationsFromTimeTableItems';
import useProgramItemFilteredByDate from 'lib/strapi/useProgramItemsFilteredByDate';

interface Props {
    concerts: Array<Concert>;
    workshops: Array<Workshop>;
    readings: Array<Reading>;
    performances: Array<Performance>;
}

const TimeTable = ({ concerts, workshops, readings, performances }: Props): ReactElement => {

    // TODO: use more context

    const availableDates = useAvailableDates();

    const [date, setDate] = useState<Date>(availableDates[0]);

    const concertsFilteredByDate = useConcertsFilteredByDate(concerts, date);
    const workshopsFilteredByDate = useProgramItemFilteredByDate<Workshop>(workshops, date);
    const performancesFilteredByDate = useProgramItemFilteredByDate<Performance>(performances, date);
    const readingsFilteredByDate = useProgramItemFilteredByDate<Reading>(readings, date);

    const locations = useLocationsFromTimeTableItems([
        ...concertsFilteredByDate,
        ...workshopsFilteredByDate,
        ...performancesFilteredByDate,
        ...readingsFilteredByDate,
    ]);

    return (
        <div>
            <div className="text-4xl">
                Slotplan
            </div>

            <div className="my-4">
                <TimeTableDateSelects
                    date={date}
                    handleDateChange={setDate}
                />
            </div>

            {locations.length > 0 ? (
                <div className="mb-20 -ml-5 pl-10 pr-5 pb-3 overflow-x-auto">
                    <div className="flex gap-[1px]">
                        {locations.map(location => (
                            <TimeTableLocationHeadline
                                key={location.id}
                                location={location}
                            />
                        ))}
                    </div>
                    <div className="flex gap-[1px] bg-gray-300">
                        {locations.map((location, index) => (
                            <TimeTableLocation
                                key={location.id}
                                location={location}
                                concerts={concertsFilteredByDate}
                                workshops={workshopsFilteredByDate}
                                performances={performancesFilteredByDate}
                                readings={readingsFilteredByDate}
                                date={date}
                                isFirstLocation={index === 0}
                            />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="bg-orange-200 border-orange-700 text-orange-700 py-3 px-4 rounded">
                    Für diesen Tag gibt es noch keine Programmpunkte!
                </div>
            )}

        </div>
    );
};

export default TimeTable;
