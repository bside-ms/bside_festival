import { useState } from 'react';
import type { ReactElement } from 'react';
import TimeTableDateSelects from 'components/program/timeTable/TimeTableDateSelects';
import TimeTableErroneousProgramItems from 'components/program/timeTable/TimeTableErroneousProgramItems';
import TimeTableLocations from 'components/program/timeTable/TimeTableLocations';
import type Concert from 'lib/strapi/typings/Concert';
import type ErroneousProgramItem from 'lib/strapi/typings/ErroneousProgramItem';
import type Performance from 'lib/strapi/typings/Performance';
import type ProgramDate from 'lib/strapi/typings/ProgramDate';
import type Reading from 'lib/strapi/typings/Reading';
import type Workshop from 'lib/strapi/typings/Workshop';
import useAvailableDates from 'lib/strapi/useAvailableDates';
import useLocationsFromTimeTableItems from 'lib/strapi/useLocationsFromTimeTableItems';
import useProgramItemFilteredByDate from 'lib/strapi/useProgramItemsFilteredByDate';

interface Props {
    concerts: Array<Concert>;
    workshops: Array<Workshop>;
    readings: Array<Reading>;
    performances: Array<Performance>;
    erroneousProgramItems: Array<ErroneousProgramItem>;
}

const TimeTable = ({ concerts, workshops, readings, performances, erroneousProgramItems }: Props): ReactElement => {

    // TODO: use more context

    const availableDates = useAvailableDates();

    const [date, setDate] = useState<ProgramDate>(availableDates[0]);

    const concertsFilteredByDate = useProgramItemFilteredByDate<Concert>(concerts, date);
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

            {erroneousProgramItems.length > 0 && (
                <div className="my-4">
                    <TimeTableErroneousProgramItems
                        erroneousProgramItems={erroneousProgramItems}
                    />
                </div>
            )}

            <div className="my-4">
                <TimeTableDateSelects
                    date={date}
                    handleDateChange={setDate}
                />
            </div>

            {locations.length > 0 ? (
                <TimeTableLocations
                    date={date}
                    locations={locations}
                    concerts={concertsFilteredByDate}
                    readings={readingsFilteredByDate}
                    performances={performancesFilteredByDate}
                    workshops={workshopsFilteredByDate}
                />
            ) : (
                <div className="bg-orange-200 border-orange-700 text-orange-700 py-3 px-4 rounded">
                    Für diesen Tag gibt es noch keine Programmpunkte!
                </div>
            )}

        </div>
    );
};

export default TimeTable;
