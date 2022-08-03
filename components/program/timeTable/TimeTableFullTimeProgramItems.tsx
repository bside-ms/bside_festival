import type { ReactElement } from 'react';
import TimeTableFullTimeProgramItem from 'components/program/timeTable/TimeTableFullTimeProgramItem';
import type Exhibition from 'lib/strapi/typings/Exhibition';
import type Food from 'lib/strapi/typings/Food';
import type InformationBooth from 'lib/strapi/typings/InformationBooth';
import type Location from 'lib/strapi/typings/Location';
import useProgramItemFilteredByLocationId from 'lib/strapi/useProgramItemFilteredByLocationId';

interface Props {
    location: Location;
    exhibitions: Array<Exhibition>;
    foods: Array<Food>;
    informationBooths: Array<InformationBooth>;
}

const TimeTableFullTimeProgramItems = ({
    location,
    exhibitions,
    foods,
    informationBooths,
}: Props): ReactElement => {

    const exhibitionsFilteredByLocation = useProgramItemFilteredByLocationId(exhibitions, location.id);
    const foodsFilteredByLocation = useProgramItemFilteredByLocationId(foods, location.id);
    const informationBoothsFilteredByLocation = useProgramItemFilteredByLocationId(informationBooths, location.id);

    return (
        <div className="w-[200px] shrink-0 space-y-3 pb-3">
            {exhibitionsFilteredByLocation.map((exhibition) => (
                <TimeTableFullTimeProgramItem
                    key={exhibition.id}
                    fullTimeProgramItem={exhibition}
                />
            ))}
            {foodsFilteredByLocation.map((food) => (
                <TimeTableFullTimeProgramItem
                    key={food.id}
                    fullTimeProgramItem={food}
                />
            ))}
            {informationBoothsFilteredByLocation.map((informationBooth) => (
                <TimeTableFullTimeProgramItem
                    key={informationBooth.id}
                    fullTimeProgramItem={informationBooth}
                />
            ))}
        </div>
    );
};

export default TimeTableFullTimeProgramItems;
