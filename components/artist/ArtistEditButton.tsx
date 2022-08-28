import { faWrench } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import type { ReactElement } from 'react';
import isGroupMember from 'lib/next-auth/isGroupMember';
import getStrapiCollectionTypeUrl from 'lib/strapi/getStrapiCollectionTypeUrl';
import type Artist from 'lib/strapi/typings/Artist';
import type StrapiCollectionType from 'lib/strapi/typings/StrapiCollectionType';

interface Props {
    artist: Artist;
    strapiCollectionType: StrapiCollectionType;
}

const ArtistEditButton = ({ strapiCollectionType, artist }: Props): ReactElement | null => {

    const { data: session } = useSession();
    const isInFestivalGroup = isGroupMember('/kreise/festival/mitglieder', session);

    if (!isInFestivalGroup) {
        return null;
    }

    const singularCollectionType = strapiCollectionType.replace(/s$/, '');
    // @ts-expect-error | I mixed up plural and singular collection types.. it's too late to fix that x)
    const strapiUrl = getStrapiCollectionTypeUrl(singularCollectionType, artist.id);

    return (
        <Link href={strapiUrl}>
            <a className="text-blue-500 hover:text-blue-700" target="_blank">
                <FontAwesomeIcon icon={faWrench} /> Bearbeiten
            </a>
        </Link>
    );
};

export default ArtistEditButton;
