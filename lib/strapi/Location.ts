import type GenericImagesData from 'lib/strapi/GenericImagesData';
import type GenericLinksData from 'lib/strapi/GenericLinksData';

export default interface Location {
    id: number;
    attributes: {
        Name: string;
        Images: GenericImagesData;
        Description: string;
        Address: string | null;
        Coordinates: string | null;
        Links: GenericLinksData;
        publishedAt: string | null;
    };

}
