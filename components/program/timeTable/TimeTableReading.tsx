import { differenceInMinutes } from 'date-fns';
import type { ReactElement } from 'react';
import ApplicationType from 'lib/application-form/ApplicationType';
import useApplicationTypeColor from 'lib/applications/useApplicationTypeColor';
import useFormattedDate from 'lib/common/useFormattedDate';
import type Reading from 'lib/strapi/typings/Reading';
import useScaledTimeTableMinutes from 'lib/strapi/useScaledTimeTableMinutes';
import useStrapiCollectionTypeUrl from 'lib/strapi/useStrapiCollectionTypeUrl';

interface Props {
    optimizedTimeTableBegin: Date;
    optimizedTimeTableEnd: Date;
    reading: Reading;
}

const TimeTableReading = (
    { optimizedTimeTableBegin, reading: { id, attributes: { Date: ProgramItemDate, Begin, End, reading_artist } } }: Props
): ReactElement => {

    const formattedBegin = useFormattedDate(new Date(`${ProgramItemDate} ${Begin}`), 'HH:mm');
    const formattedEnd = useFormattedDate(new Date(`${ProgramItemDate} ${End}`), 'HH:mm');

    const strapiUrl = useStrapiCollectionTypeUrl('reading', id);

    const diffInMinutesFromStartOfDay = useScaledTimeTableMinutes(differenceInMinutes(new Date(`${ProgramItemDate} ${Begin}`), optimizedTimeTableBegin));
    // eslint-disable-next-line max-len
    const diffInMinutesFromBeginToEnd = useScaledTimeTableMinutes(differenceInMinutes(new Date(`${ProgramItemDate} ${End}`), new Date(`${ProgramItemDate} ${Begin}`)));

    const artistName = reading_artist.data?.attributes.Name ?? null;

    const backgroundColor = useApplicationTypeColor(ApplicationType.lesung);

    return (
        <a
            className="absolute p-1 rounded drop-shadow-md"
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

export default TimeTableReading;
