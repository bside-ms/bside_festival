import { differenceInMinutes } from 'date-fns';
import type { ReactElement } from 'react';
import useApplicationTypeColor from 'lib/applications/useApplicationTypeColor';
import formatDate from 'lib/common/formatDate';
import getDetailsFromProgramItem from 'lib/strapi/getDetailsFromProgramItem';
import type ProgramItem from 'lib/strapi/typings/ProgramItem';
import useScaledTimeTableMinutes from 'lib/strapi/useScaledTimeTableMinutes';
import useStrapiCollectionTypeUrl from 'lib/strapi/useStrapiCollectionTypeUrl';

interface Props {
    optimizedTimeTableBegin: Date;
    optimizedTimeTableEnd: Date;
    programItem: ProgramItem;
}

const TimeTableProgramItem = ({ optimizedTimeTableBegin, programItem }: Props): ReactElement => {

    const beginFromItem = new Date(programItem.attributes.Begin);
    const endFromItem = new Date(programItem.attributes.End);

    const formattedBegin = formatDate(beginFromItem, 'HH:mm');
    const formattedEnd = formatDate(endFromItem, 'HH:mm');

    const diffInMinutesFromStartOfDay = useScaledTimeTableMinutes(differenceInMinutes(beginFromItem, optimizedTimeTableBegin));
    const diffInMinutesFromBeginToEnd = useScaledTimeTableMinutes(differenceInMinutes(endFromItem, beginFromItem));

    const { artistName, collectionType, applicationType } = getDetailsFromProgramItem(programItem);

    const strapiUrl = useStrapiCollectionTypeUrl(collectionType, programItem.id);

    const backgroundColor = useApplicationTypeColor(applicationType);

    return (
        <a
            className="absolute p-1 rounded-md drop-shadow-md"
            style={{
                top: `${diffInMinutesFromStartOfDay}px`,
                left: '5px',
                right: '5px',
                height: `${diffInMinutesFromBeginToEnd}px`,
                backgroundColor: `${backgroundColor}CC`,
            }}
            href={strapiUrl}
            target="_blank"
        >
            {formattedBegin} - {formattedEnd} {artistName === null ? null : ` - ${artistName}`}
        </a>
    );
};

export default TimeTableProgramItem;
