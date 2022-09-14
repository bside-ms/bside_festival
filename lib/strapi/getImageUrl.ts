import type { GenericImagesAttributes } from 'lib/strapi/typings/GenericImagesData';
import type GenericImagesData from 'lib/strapi/typings/GenericImagesData';

const getImageUrl = (
    imagesData: GenericImagesData,
    withFallback = true,
    preferredSize: keyof GenericImagesAttributes['formats'] = 'thumbnail',
    fixImageUrl = false
): string | null => {

    if (imagesData.data === null || imagesData.data[0]?.attributes === undefined) {
        return withFallback ? 'https://place-puppy.com/300x300' : null;
    }

    const imageAttributes = imagesData.data[0].attributes;

    const imageUrl = imageAttributes.formats[preferredSize]?.url ??
        imageAttributes.formats.thumbnail?.url ??
        imageAttributes.formats.small?.url ??
        imageAttributes.formats.medium?.url ??
        imageAttributes.formats.large?.url ??
        imageAttributes.url;

    if (!fixImageUrl) {
        return imageUrl;
    }

    return `https://cms.b-side.ms${imageUrl}`;
};

export default getImageUrl;
