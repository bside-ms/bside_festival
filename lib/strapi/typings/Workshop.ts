import type Location from 'lib/strapi/typings/Location';
import type WorkshopOrganizer from 'lib/strapi/typings/WorkshopOrganizer';

export default interface Workshop {
    id: number;
    attributes: {
        Date: string;
        Begin: string;
        End: string;
        workshop_organizer: { data: WorkshopOrganizer | null };
        location: { data: Location | null };
        publishedAt: string | null;
    };
}
