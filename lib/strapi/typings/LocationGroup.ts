import type GenericImagesData from 'lib/strapi/typings/GenericImagesData';
import type GenericLinksData from 'lib/strapi/typings/GenericLinksData';
import type Location from 'lib/strapi/typings/Location';

export default interface LocationGroup {
    id: number;
    attributes: {
        Name: string;
        locations: { data: Array<Location> };
        Images: GenericImagesData;
        Description: string;
        accessibilityHint: string | null;
        Links: GenericLinksData;
        publishedAt: string | null;
    };

}
