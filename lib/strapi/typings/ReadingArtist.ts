import type GenericImagesData from 'lib/strapi/typings/GenericImagesData';
import type GenericLinksData from 'lib/strapi/typings/GenericLinksData';

export default interface ReadingArtist {
    id: number;
    attributes: {
        Name: string;
        Images: GenericImagesData;
        Description: string;
        Links: GenericLinksData;
        publishedAt: string | null;
    };
}
