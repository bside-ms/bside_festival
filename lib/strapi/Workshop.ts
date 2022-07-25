import type Location from 'lib/strapi/Location';
import type WorkshopOrganizer from 'lib/strapi/WorkshopOrganizer';

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
