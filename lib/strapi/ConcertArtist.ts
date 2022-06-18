import type GenericImagesData from 'lib/strapi/GenericImagesData';
import type GenericLinksData from 'lib/strapi/GenericLinksData';

export default interface ConcertArtist {
    id: number;
    attributes: {
        Name: string;
        Images: GenericImagesData;
        Description: string;
        Links: GenericLinksData;
        publishedAt: string | null;
    };
}
