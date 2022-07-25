import { useState } from 'react';
import type { ReactElement } from 'react';
import TimeTableDateSelects from 'components/program/timeTable/TimeTableDateSelects';
import TimeTableLocation from 'components/program/timeTable/TimeTableLocation';
import TimeTableLocationHeadline from 'components/program/timeTable/TimeTableLocationHeadline';
import type Concert from 'lib/strapi/Concert';
import useAvailableDates from 'lib/strapi/useAvailableDates';
import useConcertsFilteredByDate from 'lib/strapi/useConcertsFilteredByDate';
import useLocationsFromTimeTableItems from 'lib/strapi/useLocationsFromTimeTableItems';
import useWorkshopsFilteredByDate from 'lib/strapi/useWorkshopsFilteredByDate';
import type Workshop from 'lib/strapi/Workshop';

interface Props {
    concerts: Array<Concert>;
    workshops: Array<Workshop>;
}

const TimeTable = ({ concerts, workshops }: Props): ReactElement => {

    // TODO: use more context

    const availableDates = useAvailableDates();

    const [date, setDate] = useState<Date>(availableDates[0]);

    const concertsFilteredByDate = useConcertsFilteredByDate(concerts, date);
    const workshopsFilteredByDate = useWorkshopsFilteredByDate(workshops, date);

    const locations = useLocationsFromTimeTableItems([...concertsFilteredByDate, ...workshopsFilteredByDate]);

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
