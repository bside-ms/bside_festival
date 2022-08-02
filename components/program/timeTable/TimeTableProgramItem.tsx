import { differenceInMinutes } from 'date-fns';
import type { ReactElement } from 'react';
import ApplicationType from 'lib/application-form/ApplicationType';
import useApplicationTypeColor from 'lib/applications/useApplicationTypeColor';
import useFormattedDate from 'lib/common/useFormattedDate';
import type ProgramItem from 'lib/strapi/typings/ProgramItem';
import type StrapiCollectionType from 'lib/strapi/typings/StrapiCollectionType';
import useScaledTimeTableMinutes from 'lib/strapi/useScaledTimeTableMinutes';
import useStrapiCollectionTypeUrl from 'lib/strapi/useStrapiCollectionTypeUrl';

interface Props {
    optimizedTimeTableBegin: Date;
    optimizedTimeTableEnd: Date;
    programItem: ProgramItem;
}

const getDetailsFromProgramItem = (programItem: ProgramItem): [string | null, StrapiCollectionType, ApplicationType] => {

    if ('concert_artist' in programItem.attributes) {
        return [
            programItem.attributes.concert_artist.data?.attributes.Name ?? null,
            'concert',
            ApplicationType.konzert,
        ];
    }
    if ('workshop_organizer' in programItem.attributes) {
        return [
            programItem.attributes.workshop_organizer.data?.attributes.Name ?? null,
            'workshop',
            ApplicationType.workshop,
        ];
    }
    if ('reading_artist' in programItem.attributes) {
        return [
            programItem.attributes.reading_artist.data?.attributes.Name ?? null,
            'reading',
            ApplicationType.lesung,
        ];
    }
    if ('performance_artist' in programItem.attributes) {
        return [
            programItem.attributes.performance_artist.data?.attributes.Name ?? null,
            'performance',
            ApplicationType.performance,
        ];
    }

    throw new Error(`Received unexpected program item: ${JSON.stringify(programItem)}`);
};

const TimeTableProgramItem = ({ optimizedTimeTableBegin, programItem }: Props): ReactElement => {

    const beginFromItem = new Date(programItem.attributes.Begin);
    const endFromItem = new Date(programItem.attributes.End);

    const formattedBegin = useFormattedDate(beginFromItem, 'HH:mm');
    const formattedEnd = useFormattedDate(endFromItem, 'HH:mm');

    const diffInMinutesFromStartOfDay = useScaledTimeTableMinutes(differenceInMinutes(beginFromItem, optimizedTimeTableBegin));
    const diffInMinutesFromBeginToEnd = useScaledTimeTableMinutes(differenceInMinutes(endFromItem, beginFromItem));

    const [name, collectionType, applicationType] = getDetailsFromProgramItem(programItem);

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
            {formattedBegin} - {formattedEnd} {name === null ? null : ` - ${name}`}
        </a>
    );
};

export default TimeTableProgramItem;
