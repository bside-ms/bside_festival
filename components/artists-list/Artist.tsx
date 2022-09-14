import type { ReactElement } from 'react';
import ArtistDescription from 'components/artist/ArtistDescription';
import ArtistEditButton from 'components/artist/ArtistEditButton';
import ArtistLinks from 'components/artist/ArtistLinks';
import ArtistName from 'components/artist/ArtistName';
import ArtistUnpublishedTag from 'components/artist/ArtistUnpublishedTag';
import getImageUrl from 'lib/strapi/getImageUrl';
import type { default as ArtistModel } from 'lib/strapi/typings/Artist';
import type StrapiCollectionType from 'lib/strapi/typings/StrapiCollectionType';

interface Props {
    artist: ArtistModel;
    strapiCollectionType: StrapiCollectionType;
}

const Artist = ({ artist, strapiCollectionType }: Props): ReactElement => {

    return (
        <div key={artist.id} className="p-4 bg-gradient-to-b from-gray-200 to-gray-50 rounded space-y-3">
            <div className="flex space-x-4">
                <div className="flex flex-col space-y-3">
                    <div
                        className="rounded-full h-32 w-32 bg-center bg-cover"
                        style={{ backgroundImage: `url(${getImageUrl(artist.attributes.Images)!})` }}
                    />

                    <ArtistUnpublishedTag artist={artist} />

                    <ArtistEditButton artist={artist} strapiCollectionType={strapiCollectionType} />
                </div>

                <div className="space-y-3">
                    <ArtistName artist={artist} />

                    <ArtistDescription artist={artist} />

                    <ArtistLinks artist={artist} />
                </div>
            </div>
        </div>
    );
};

export default Artist;
