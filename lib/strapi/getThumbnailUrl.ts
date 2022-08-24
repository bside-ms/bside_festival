import type Artist from 'lib/strapi/typings/Artist';
import type Location from 'lib/strapi/typings/Location';

const getThumbnailUrl = (artist: Artist | Location, withFallback = true): string | null => {

    if (artist.attributes.Images.data === null || artist.attributes.Images.data[0]?.attributes === undefined) {
        return withFallback ? 'https://place-puppy.com/300x300' : null;
    }

    const imageAttributes = artist.attributes.Images.data[0].attributes;

    return (
        imageAttributes.formats.thumbnail?.url ??
        imageAttributes.formats.small?.url ??
        imageAttributes.formats.medium?.url ??
        imageAttributes.formats.large?.url ??
        imageAttributes.url
    );
};

export default getThumbnailUrl;
