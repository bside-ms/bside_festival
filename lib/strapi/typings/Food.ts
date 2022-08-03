import type FoodOrganizer from 'lib/strapi/typings/FoodOrganizer';
import type Location from 'lib/strapi/typings/Location';

export default interface Food {
    id: number;
    attributes: {
        Begin: string;
        End: string;
        food_organizer: { data: FoodOrganizer | null };
        location: { data: Location | null };
        publishedAt: string | null;
    };
}
