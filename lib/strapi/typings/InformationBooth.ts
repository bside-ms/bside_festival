import type InformationBoothOrganizer from 'lib/strapi/typings/InformationBoothOrganizer';
import type Location from 'lib/strapi/typings/Location';

export default interface InformationBooth {
    id: number;
    attributes: {
        Begin: string;
        End: string;
        information_booth_organizer: { data: InformationBoothOrganizer | null };
        location: { data: Location | null };
        publishedAt: string | null;
    };
}
