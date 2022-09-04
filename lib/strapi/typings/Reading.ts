import type Location from 'lib/strapi/typings/Location';
import type ReadingArtist from 'lib/strapi/typings/ReadingArtist';
import type Registration from 'lib/strapi/typings/Registration';

export default interface Reading {
    id: number;
    attributes: {
        Date: string;
        Begin: string;
        End: string;
        reading_artist: { data: ReadingArtist | null };
        location: { data: Location | null };
        publishedAt: string | null;
        Registration: Registration | null;
    };
}
