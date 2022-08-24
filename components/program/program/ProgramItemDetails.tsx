import type { ReactElement } from 'react';
import formatDate from 'lib/common/formatDate';
import type ProgramItem from 'lib/strapi/typings/ProgramItem';

interface Props {
    programItem: ProgramItem;
}

const ProgramItemDetails = ({ programItem }: Props): ReactElement => {

    const beginFromItem = new Date(programItem.attributes.Begin);
    const endFromItem = new Date(programItem.attributes.End);

    const formattedBegin = formatDate(beginFromItem, 'HH:mm');
    const formattedEnd = formatDate(endFromItem, 'HH:mm');

    const location = programItem.attributes.location.data?.attributes.Name ?? null;

    return (
        <div className="leading-5 mt-2">
            <div>{formattedBegin} - {formattedEnd}</div>

            {location !== null && (
                <div>{location}</div>
            )}
        </div>
    );
};

export default ProgramItemDetails;
