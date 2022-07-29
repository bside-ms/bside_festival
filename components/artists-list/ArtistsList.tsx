import type { ReactElement } from 'react';
import Artist from 'components/artists-list/Artist';
import type { default as ArtistModel } from 'lib/strapi/typings/Artist';

interface Props {
    artists: Array<ArtistModel> | null;
    title: string;
}

const ArtistsList = ({ artists, title }: Props): ReactElement | null => {

    if (artists === null || artists.length === 0) {
        return null;
    }

    return (
        <div>
            <h1 className="text-4xl mb-3 bg-gray-800 text-gray-200 p-2">
                {title}
            </h1>

            {artists.map(artist => (
                <Artist
                    key={artist.id}
                    artist={artist}
                    strapiCollectionType="concert-artists"
                />
            ))}
        </div>
    );
};

export default ArtistsList;
