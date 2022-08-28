import styles from './Artist.module.scss';

import type { ReactElement } from 'react';
import ArtistDescription from 'components/artist/ArtistDescription';
import ArtistEditButton from 'components/artist/ArtistEditButton';
import ArtistLinks from 'components/artist/ArtistLinks';
import ArtistName from 'components/artist/ArtistName';
import ArtistUnpublishedTag from 'components/artist/ArtistUnpublishedTag';
import Button from 'components/common/Button';
import getImageUrl from 'lib/strapi/getImageUrl';
import type { default as ArtistModel } from 'lib/strapi/typings/Artist';
import type StrapiCollectionType from 'lib/strapi/typings/StrapiCollectionType';

interface Props {
    artist: ArtistModel;
    strapiCollectionType: StrapiCollectionType;
    onCloseClick?: () => void;
}

const Artist = ({ artist, strapiCollectionType, onCloseClick }: Props): ReactElement => {

    const imageRelativeUrl = getImageUrl(artist, false, 'medium');
    const imageUrl = imageRelativeUrl === null ? null : `https://cms.b-side.ms${imageRelativeUrl}`;

    return (
        <div key={artist.id} className={`space-y-3 relative z-50 ${styles.artist ?? ''}`}>
            <div className="flex flex-col md:space-x-4 md:flex-row z-50 relative bg-white">
                <div
                    className="h-[400px] w-full md:min-h-[500px] md:shrink-0 md:w-1/3 bg-center bg-cover"
                    style={{ backgroundImage: imageUrl === null ? undefined : `url(${imageUrl})` }}
                />

                <div className="p-4 space-y-3 z-50 relative">
                    <ArtistUnpublishedTag artist={artist} />

                    <ArtistEditButton artist={artist} strapiCollectionType={strapiCollectionType} />

                    <ArtistName artist={artist} />

                    <ArtistDescription artist={artist} />

                    <ArtistLinks artist={artist} />

                    {onCloseClick !== undefined && (
                        <div className="my-4 md:hidden">
                            <Button onClick={onCloseClick} withFullWidth={true}>
                                Zurück zum Programm
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Artist;
