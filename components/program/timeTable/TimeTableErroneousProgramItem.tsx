import { Link } from '@mui/material';
import type { ReactElement } from 'react';
import useFormattedDate from 'lib/common/useFormattedDate';
import type ErroneousProgramItem from 'lib/strapi/typings/ErroneousProgramItem';
import type StrapiCollectionType from 'lib/strapi/typings/StrapiCollectionType';
import useBeginFromItem from 'lib/strapi/useBeginFromItem';
import useEndFromItem from 'lib/strapi/useEndFromItem';
import useStrapiCollectionTypeUrl from 'lib/strapi/useStrapiCollectionTypeUrl';

interface Props {
    erroneousProgramItem: ErroneousProgramItem;
}

const getCollectionTypeTitle = (strapiCollectionType: StrapiCollectionType): string => {

    switch (strapiCollectionType) {
        case 'concert':
        case 'concert-artists':
            return 'Konzert';

        case 'workshop':
        case 'workshops-organizers':
            return 'Workshop';

        case 'reading':
        case 'reading-artists':
            return 'Lesung';

        case 'performance-artists':
        case 'performance':
            return 'Performance';
    }
};

const TimeTableErroneousProgramItem = ({ erroneousProgramItem: { collectionType, programItem, reason } }: Props): ReactElement => {

    const title = getCollectionTypeTitle(collectionType);

    const beginFromItem = useFormattedDate(useBeginFromItem(programItem), 'dd.MM.yyyy, HH:mm \'Uhr\'');
    const endFromItem = useFormattedDate(useEndFromItem(programItem), 'dd.MM.yyyy, HH:mm \'Uhr\'');

    const locationName = programItem.attributes.location.data?.attributes.Name ?? null;

    const strapiUrl = useStrapiCollectionTypeUrl(collectionType, programItem.id);

    return (
        <div className="space-x-1.5">
            <span>
                {title} {beginFromItem} - {endFromItem}{locationName !== null ? ` (${locationName})` : null}: {reason}
            </span>

            <Link href={strapiUrl} target="_blank">
                Bearbeiten
            </Link>
        </div>
    );
};

export default TimeTableErroneousProgramItem;
