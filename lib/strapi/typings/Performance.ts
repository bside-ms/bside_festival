import type Location from 'lib/strapi/typings/Location';
import type PerformanceArtist from 'lib/strapi/typings/PerformanceArtist';

export default interface Performance {
    id: number;
    attributes: {
        Date: string;
        Begin: string;
        End: string;
        performance_artist: { data: PerformanceArtist | null };
        location: { data: Location | null };
        publishedAt: string | null;
    };
}
