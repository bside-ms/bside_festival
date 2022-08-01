import { differenceInMinutes } from 'date-fns';
import type { ReactElement } from 'react';
import ApplicationType from 'lib/application-form/ApplicationType';
import useApplicationTypeColor from 'lib/applications/useApplicationTypeColor';
import useFormattedDate from 'lib/common/useFormattedDate';
import type Concert from 'lib/strapi/typings/Concert';
import useBeginFromItem from 'lib/strapi/useBeginFromItem';
import useEndFromItem from 'lib/strapi/useEndFromItem';
import useScaledTimeTableMinutes from 'lib/strapi/useScaledTimeTableMinutes';
import useStrapiCollectionTypeUrl from 'lib/strapi/useStrapiCollectionTypeUrl';

interface Props {
    optimizedTimeTableBegin: Date;
    optimizedTimeTableEnd: Date;
    concert: Concert;
}

const TimeTableConcert = ({ optimizedTimeTableBegin, concert }: Props): ReactElement => {

    const { id, attributes: { concert_artist } } = concert;

    const concertBegin = useBeginFromItem(concert);
    const concertEnd = useEndFromItem(concert);

    const formattedBegin = useFormattedDate(concertBegin, 'HH:mm');
    const formattedEnd = useFormattedDate(concertEnd, 'HH:mm');

    const strapiUrl = useStrapiCollectionTypeUrl('concert', id);

    const diffInMinutesFromStartOfDay = useScaledTimeTableMinutes(differenceInMinutes(concertBegin, optimizedTimeTableBegin));
    const diffInMinutesFromBeginToEnd = useScaledTimeTableMinutes(differenceInMinutes(concertEnd, concertBegin));

    const concertArtistName = concert_artist.data?.attributes.Name ?? null;

    const backgroundColor = useApplicationTypeColor(ApplicationType.konzert);

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
            {formattedBegin} - {formattedEnd} {concertArtistName === null ? null : ` - ${concertArtistName}`}
        </a>
    );
};

export default TimeTableConcert;
