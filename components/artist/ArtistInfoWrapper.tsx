import type { ReactElement } from 'react';
import Artist from 'components/artist/Artist';
import ContentWrapper from 'components/common/ContentWrapper';
import SwrResponseWrapper from 'components/strapi/SwrResponseWrapper';
import type ApplicationType from 'lib/application-form/ApplicationType';
import getCollectionTypeFromApplicationType from 'lib/program/getCollectionTypeFromApplicationType';
import type { default as ArtistModel } from 'lib/strapi/typings/Artist';
import useArtist from 'lib/strapi/useArtist';

interface Props {
    applicationType: ApplicationType;
    artistId: string;
}

const ArtistInfoWrapper = ({ applicationType, artistId }: Props): ReactElement => {

    const collectionType = getCollectionTypeFromApplicationType(applicationType);

    const artistResponse = useArtist(collectionType, artistId);

    return (
        <div className="pt-[250px] pb-20 bg-black">
            <ContentWrapper>
                <SwrResponseWrapper<Array<ArtistModel>> response={artistResponse}>
                    {(artists): ReactElement => (
                        <Artist
                            artist={artists[0]!}
                            strapiCollectionType={collectionType}
                        />
                    )}
                </SwrResponseWrapper>
            </ContentWrapper>
        </div>
    );
};

export default ArtistInfoWrapper;
