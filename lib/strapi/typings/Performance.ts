import type Location from 'lib/strapi/typings/Location';
import type PerformanceArtist from 'lib/strapi/typings/PerformanceArtist';
import type Registration from 'lib/strapi/typings/Registration';

export default interface Performance {
    id: number;
    attributes: {
        Date: string;
        Begin: string;
        End: string;
        performance_artist: { data: PerformanceArtist | null };
        location: { data: Location | null };
        publishedAt: string | null;
        Registration: Registration | null;
    };
}
