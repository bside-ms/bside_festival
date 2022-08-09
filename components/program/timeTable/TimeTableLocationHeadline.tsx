import type { ReactElement } from 'react';
import { useLocationGroupOfLocation } from 'lib/context/LocationGroupsContext';
import type Location from 'lib/strapi/typings/Location';

interface Props {
    location: Location;
}

const TimeTableLocationHeadline = ({ location }: Props): ReactElement => {

    const groupOfLocation = useLocationGroupOfLocation(location);

    return (
        <div className="w-[200px] shrink-0">
            <div className="text-2xl mb-2 mr-2 break-words align-text-bottom">
                <div className="uppercase text-xs font-sans truncate">
                    {groupOfLocation?.attributes.Name ?? '\u00A0'}
                </div>

                {location.attributes.Name}
            </div>
        </div>
    );
};

export default TimeTableLocationHeadline;
