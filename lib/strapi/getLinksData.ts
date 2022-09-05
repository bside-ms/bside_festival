import type { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faFacebook, faInstagram, faSoundcloud, faSpotify, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import createUrlRegExp from 'url-regex-safe';
import type GenericLinksData from 'lib/strapi/typings/GenericLinksData';
import type LinksData from 'lib/strapi/typings/LinksData';

const splitLinks = (link: string): Array<string> => {

    const urlRegExp = createUrlRegExp();

    let matches = null;
    const allLinks = new Array<string>();

    do {
        matches = urlRegExp.exec(link);

        if (matches === null) {
            continue;
        }

        let matchedUrl = matches[0]!;

        if (matchedUrl.endsWith(',')) {
            matchedUrl = matchedUrl.slice(0, -1);
        }

        const usedUrl = (
            !createUrlRegExp({ strict: true }).test(matchedUrl) &&
            createUrlRegExp({ strict: true }).test(`http://${matchedUrl}`)
                ? `http://${matchedUrl}`
                : matchedUrl
        );

        allLinks.push(usedUrl);
    } while (matches !== null);

    return allLinks;
};

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

const getLinksData = (links: GenericLinksData): Array<LinksData> => {

    return links
        .reduce(
            (currentActualLinks, link) => {

                if (link.Link === null || link.Link === '') {
                    return currentActualLinks;
                }

                return [...currentActualLinks, ...splitLinks(link.Link)];
            },
            new Array<string>()
        )
        .map<LinksData>(link => ({
            url: link,
            ...getLabelAndIcon(link),
        }));
};

export default getLinksData;
