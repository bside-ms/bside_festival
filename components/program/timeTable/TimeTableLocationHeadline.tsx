import type { ReactElement } from 'react';
import getGroupOfLocation from 'lib/strapi/getGroupOfLocation';
import type Location from 'lib/strapi/typings/Location';
import type LocationGroup from 'lib/strapi/typings/LocationGroup';

interface Props {
    location: Location;
    locationGroups: Array<LocationGroup>;
}

const TimeTableLocationHeadline = ({ location, locationGroups }: Props): ReactElement => {

    const groupOfLocation = getGroupOfLocation(location, locationGroups);

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
