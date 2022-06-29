import { faFacebook, faInstagram, faSoundcloud, faSpotify, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-common-types';
import type ConcertArtist from 'lib/strapi/ConcertArtist';
import type LinksData from 'lib/strapi/LinksData';

const getLabelAndIcon = (url: string): { label: string, icon: IconDefinition } => {

    if (url.startsWith('https://open.spotify.com')) {
        return { label: 'Spotify', icon: faSpotify };
    }

    if (url.startsWith('https://www.youtube.com') || url.startsWith('https://youtu.be')) {
        return { label: 'YouTube', icon: faYoutube };
    }

    if (url.startsWith('https://soundcloud.com')) {
        return { label: 'SoundCloud', icon: faSoundcloud };
    }

    if (url.startsWith('https://www.facebook.com')) {
        return { label: 'Facebook', icon: faFacebook };
    }

    if (url.startsWith('https://www.instagram.com')) {
        return { label: 'Instagram', icon: faInstagram };
    }

    return { label: 'Website', icon: faGlobe };
};

const useLinksData = (links: ConcertArtist['attributes']['Links']): Array<LinksData> => {

    return links.map<LinksData>(link => {
        return {
            url: link.Link,
            ...getLabelAndIcon(link.Link),
        };
    });
};

export default useLinksData;
