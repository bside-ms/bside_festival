import type GenericImagesData from 'lib/strapi/typings/GenericImagesData';
import type GenericLinksData from 'lib/strapi/typings/GenericLinksData';

export default interface ExhibitionArtist {
    id: number;
    attributes: {
        Name: string;
        Images: GenericImagesData;
        Description: string;
        Links: GenericLinksData;
        publishedAt: string | null;
    };
}
