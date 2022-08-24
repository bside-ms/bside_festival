import type { ReactElement } from 'react';
import type FullTimeProgramItem from 'lib/strapi/typings/FullTimeProgramItem';

interface Props {
    programItem: FullTimeProgramItem;
}

const FullTimeProgramItemDetails = ({ programItem }: Props): ReactElement => {

    const location = programItem.attributes.location.data?.attributes.Name ?? null;

    return (
        <div className="leading-5 mt-2">
            <div>Ganztägig</div>

            {location !== null && (
                <div>{location}</div>
            )}
        </div>
    );
};

export default FullTimeProgramItemDetails;
