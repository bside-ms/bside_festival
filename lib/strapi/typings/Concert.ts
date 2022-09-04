import type ConcertArtist from 'lib/strapi/typings/ConcertArtist';
import type Location from 'lib/strapi/typings/Location';
import type Registration from 'lib/strapi/typings/Registration';

export default interface Concert {
    id: number;
    attributes: {
        Begin: string;
        End: string;
        concert_artist: { data: ConcertArtist | null };
        location: { data: Location | null };
        publishedAt: string | null;
        Registration: Registration | null;
    };
}
