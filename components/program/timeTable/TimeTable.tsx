import { useState } from 'react';
import type { ReactElement } from 'react';
import TimeTableDateSelects from 'components/program/timeTable/TimeTableDateSelects';
import TimeTableErroneousProgramItems from 'components/program/timeTable/TimeTableErroneousProgramItems';
import TimeTableLocations from 'components/program/timeTable/TimeTableLocations';
import filterErroneousProgramItems from 'lib/strapi/filterErroneousProgramItems';
import type AllProgramItems from 'lib/strapi/typings/AllProgramItems';
import type Concert from 'lib/strapi/typings/Concert';
import type ErroneousProgramItem from 'lib/strapi/typings/ErroneousProgramItem';
import type Exhibition from 'lib/strapi/typings/Exhibition';
import type FamilyProgram from 'lib/strapi/typings/FamilyProgram';
import type Food from 'lib/strapi/typings/Food';
import type InformationBooth from 'lib/strapi/typings/InformationBooth';
import type Performance from 'lib/strapi/typings/Performance';
import type ProgramDate from 'lib/strapi/typings/ProgramDate';
import type Reading from 'lib/strapi/typings/Reading';
import type Workshop from 'lib/strapi/typings/Workshop';
import useAvailableDates from 'lib/strapi/useAvailableDates';
import useFullTimeProgramItemsFilteredByDate from 'lib/strapi/useFullTimeProgramItemsFilteredByDate';
import useLocationsFromTimeTableItems from 'lib/strapi/useLocationsFromTimeTableItems';
import useProgramItemFilteredByDate from 'lib/strapi/useProgramItemsFilteredByDate';

interface Props {
    concerts: Array<Concert>;
    workshops: Array<Workshop>;
    readings: Array<Reading>;
    performances: Array<Performance>;
    familyPrograms: Array<FamilyProgram>;
    exhibitions: Array<Exhibition>;
    foods: Array<Food>;
    informationBooths: Array<InformationBooth>;
}

const TimeTable = ({
    concerts,
    workshops,
    readings,
    performances,
    familyPrograms,
    exhibitions,
    foods,
    informationBooths,
}: Props): ReactElement => {

    // TODO: use more context

    const availableDates = useAvailableDates();

    const [date, setDate] = useState<ProgramDate>(availableDates[0]);

    const erroneousProgramItems = new Array<ErroneousProgramItem>();

    const allProgramItems: AllProgramItems = { concerts, workshops, performances, readings, familyPrograms };

    const filteredConcerts = filterErroneousProgramItems(concerts, 'concert', allProgramItems, erroneousProgramItems);
    const filteredPerformances = filterErroneousProgramItems(performances, 'performance', allProgramItems, erroneousProgramItems);
    const filteredReadings = filterErroneousProgramItems(readings, 'reading', allProgramItems, erroneousProgramItems);
    const filteredWorkshops = filterErroneousProgramItems(workshops, 'workshop', allProgramItems, erroneousProgramItems);
    const filteredFamilyPrograms = filterErroneousProgramItems(familyPrograms, 'family-program', allProgramItems, erroneousProgramItems);

    const concertsFilteredByDate = useProgramItemFilteredByDate(filteredConcerts, date);
    const workshopsFilteredByDate = useProgramItemFilteredByDate(filteredWorkshops, date);
    const performancesFilteredByDate = useProgramItemFilteredByDate(filteredPerformances, date);
    const readingsFilteredByDate = useProgramItemFilteredByDate(filteredReadings, date);
    const familyProgramsFilteredByDate = useProgramItemFilteredByDate(filteredFamilyPrograms, date);

    const exhibitionsFilteredByDate = useFullTimeProgramItemsFilteredByDate(exhibitions, date);
    const foodsFilteredByDate = useFullTimeProgramItemsFilteredByDate(foods, date);
    const informationBoothsFilteredByDate = useFullTimeProgramItemsFilteredByDate(informationBooths, date);

    const locations = useLocationsFromTimeTableItems([
        ...concertsFilteredByDate,
        ...workshopsFilteredByDate,
        ...performancesFilteredByDate,
        ...readingsFilteredByDate,
        ...familyProgramsFilteredByDate,
        ...exhibitionsFilteredByDate,
        ...foodsFilteredByDate,
        ...informationBoothsFilteredByDate,
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
                    familyPrograms={familyProgramsFilteredByDate}
                    exhibitions={exhibitionsFilteredByDate}
                    foods={foodsFilteredByDate}
                    informationBooths={informationBoothsFilteredByDate}
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
