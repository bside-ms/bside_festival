import { Link } from '@mui/material';
import type { ReactElement } from 'react';
import formatDate from 'lib/common/formatDate';
import getLabelFromCollectionType from 'lib/strapi/getLabelFromCollectionType';
import getStrapiCollectionTypeUrl from 'lib/strapi/getStrapiCollectionTypeUrl';
import type ErroneousProgramItem from 'lib/strapi/typings/ErroneousProgramItem';

interface Props {
    erroneousProgramItem: ErroneousProgramItem;
}

const TimeTableErroneousProgramItem = ({ erroneousProgramItem: { collectionType, programItem, reason } }: Props): ReactElement => {

    const title = getLabelFromCollectionType(collectionType);

    const beginFromItem = formatDate(programItem.attributes.Begin, 'dd.MM.yyyy, HH:mm \'Uhr\'');
    const endFromItem = formatDate(programItem.attributes.End, 'dd.MM.yyyy, HH:mm \'Uhr\'');

    const locationName = programItem.attributes.location.data?.attributes.Name ?? null;

    const strapiUrl = getStrapiCollectionTypeUrl(collectionType, programItem.id);

    return (
        <div className="space-x-1.5">
            <span>
                {title} #{programItem.id}: {beginFromItem} - {endFromItem}{locationName !== null ? ` - ${locationName}` : null}: {reason}
            </span>

            <Link href={strapiUrl} target="_blank">
                Bearbeiten
            </Link>
        </div>
    );
};

export default TimeTableErroneousProgramItem;
