import type Location from 'lib/strapi/typings/Location';
import type ReadingArtist from 'lib/strapi/typings/ReadingArtist';

export default interface Reading {
    id: number;
    attributes: {
        Date: string;
        Begin: string;
        End: string;
        reading_artist: { data: ReadingArtist | null };
        location: { data: Location | null };
        publishedAt: string | null;
    };
}
