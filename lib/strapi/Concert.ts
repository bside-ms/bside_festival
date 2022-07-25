import type ConcertArtist from 'lib/strapi/ConcertArtist';
import type Location from 'lib/strapi/Location';

export default interface Concert {
    id: number;
    attributes: {
        Begin: string;
        End: string;
        concert_artist: { data: ConcertArtist | null };
        location: { data: Location | null };
        publishedAt: string | null;
    };
}
