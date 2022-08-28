
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import type { ReactElement } from 'react';
import getLinksData from 'lib/strapi/getLinksData';
import type { default as ArtistModel } from 'lib/strapi/typings/Artist';

interface Props {
    artist: ArtistModel;
}

const ArtistLinks = ({ artist }: Props): ReactElement | null => {

    const linksData = getLinksData(artist.attributes.Links);

    if (linksData.length === 0) {
        return null;
    }

    return (
        <div className="space-x-4">
            {linksData.map(link => (
                <Link href={link.url} key={link.url}>
                    <a className="text-blue-500 hover:text-blue-700 space-x-1 align-middle leading-4" target="_blank">
                        <FontAwesomeIcon icon={link.icon} /> <span>{link.label}</span>
                    </a>
                </Link>
            ))}
        </div>
    );
};

export default ArtistLinks;
