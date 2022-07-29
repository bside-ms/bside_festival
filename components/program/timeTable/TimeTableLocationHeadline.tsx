import type { ReactElement } from 'react';
import type Location from 'lib/strapi/typings/Location';

interface Props {
    location: Location;
}

const TimeTableLocationHeadline = ({ location }: Props): ReactElement => {

    return (
        <div className="w-[200px] shrink-0">
            <div className="text-2xl mb-2 align-text-bottom">
                {location.attributes.Name}
            </div>
        </div>
    );
};

export default TimeTableLocationHeadline;
