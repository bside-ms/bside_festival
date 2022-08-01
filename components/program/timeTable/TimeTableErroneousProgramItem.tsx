import { Link } from '@mui/material';
import type { ReactElement } from 'react';
import useFormattedDate from 'lib/common/useFormattedDate';
import getBeginFromItem from 'lib/strapi/getBeginFromItem';
import getEndFromItem from 'lib/strapi/getEndFromItem';
import getLabelFromCollectionType from 'lib/strapi/getLabelFromCollectionType';
import type ErroneousProgramItem from 'lib/strapi/typings/ErroneousProgramItem';
import useStrapiCollectionTypeUrl from 'lib/strapi/useStrapiCollectionTypeUrl';

interface Props {
    erroneousProgramItem: ErroneousProgramItem;
}

const TimeTableErroneousProgramItem = ({ erroneousProgramItem: { collectionType, programItem, reason } }: Props): ReactElement => {

    const title = getLabelFromCollectionType(collectionType);

    const beginFromItem = useFormattedDate(getBeginFromItem(programItem), 'dd.MM., HH:mm');
    const endFromItem = useFormattedDate(getEndFromItem(programItem), 'dd.MM., HH:mm');

    const locationName = programItem.attributes.location.data?.attributes.Name ?? null;

    const strapiUrl = useStrapiCollectionTypeUrl(collectionType, programItem.id);

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
