import type ExhibitionArtist from 'lib/strapi/typings/ExhibitionArtist';
import type Location from 'lib/strapi/typings/Location';

export default interface Exhibition {
    id: number;
    attributes: {
        Begin: string;
        End: string;
        exhibition_artist: { data: ExhibitionArtist | null };
        location: { data: Location | null };
        publishedAt: string | null;
    };
}
