import type { ReactElement } from 'react';
import ExhibitionProgramItem from 'components/program/timeTable/ExhibitionProgramItem';
import type Exhibition from 'lib/strapi/typings/Exhibition';
import type Location from 'lib/strapi/typings/Location';
import useProgramItemFilteredByLocationId from 'lib/strapi/useProgramItemFilteredByLocationId';

interface Props {
    location: Location;
    exhibitions: Array<Exhibition>;
}

const TimeTableExhibitions = ({
    location,
    exhibitions,
}: Props): ReactElement => {

    const exhibitionsFilteredByLocation = useProgramItemFilteredByLocationId(exhibitions, location.id);

    return (
        <div className="w-[200px] shrink-0 space-y-3 pb-3">
            {exhibitionsFilteredByLocation.map((exhibition) => (
                <ExhibitionProgramItem
                    key={exhibition.id}
                    exhibition={exhibition}
                />
            ))}
        </div>
    );
};

export default TimeTableExhibitions;
