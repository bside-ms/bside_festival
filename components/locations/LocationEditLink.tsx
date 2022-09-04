import { faWrench } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import type { ReactElement } from 'react';
import isGroupMember from 'lib/next-auth/isGroupMember';
import getStrapiCollectionTypeUrl from 'lib/strapi/getStrapiCollectionTypeUrl';

interface Props {
    locationId: number;
}

const LocationEditLink = ({ locationId }: Props): ReactElement | null => {

    const { data: session } = useSession();
    const isInFestivalGroup = isGroupMember('/kreise/festival/mitglieder', session);

    const strapiUrl = getStrapiCollectionTypeUrl('location', locationId);

    if (!isInFestivalGroup) {
        return null;
    }

    return (
        <div>
            <Link href={strapiUrl}>
                <a className="text-blue-500 hover:text-blue-700" target="_blank">
                    <FontAwesomeIcon icon={faWrench} /> Bearbeiten
                </a>
            </Link>
        </div>
    );
};

export default LocationEditLink;
