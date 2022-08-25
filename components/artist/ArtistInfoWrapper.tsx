import type { ReactElement } from 'react';
import Artist from 'components/artist/Artist';
import ContentWrapper from 'components/common/ContentWrapper';
import SwrResponseWrapper from 'components/strapi/SwrResponseWrapper';
import ApplicationType from 'lib/application-form/ApplicationType';
import type { default as ArtistModel } from 'lib/strapi/typings/Artist';
import type StrapiCollectionType from 'lib/strapi/typings/StrapiCollectionType';
import useArtist from 'lib/strapi/useArtist';

interface Props {
    applicationType: ApplicationType;
    artistId: string;
}

const getCollectionType = (applicationType: ApplicationType): StrapiCollectionType => {

    switch (applicationType) {
        case ApplicationType.ausstellung:
            return 'exhibition-artists';
        case ApplicationType.performance:
            return 'performance-artists';
        case ApplicationType.konzert:
            return 'concert-artists';
        case ApplicationType.workshop:
            return 'workshop-organizers';
        case ApplicationType.infostand:
            return 'information-booth-organizers';
        case ApplicationType.familienprogramm:
            return 'family-program-organizers';
        case ApplicationType.lesung:
            return 'reading-artists';
        case ApplicationType.essensstand:
            return 'food-organizers';
        case ApplicationType.nachbarschaft:
        case ApplicationType.anderes:
            // @ts-expect-error | For now we ignore this..
            return '';
    }
};

const ArtistInfoWrapper = ({ applicationType, artistId }: Props): ReactElement => {

    const collectionType = getCollectionType(applicationType);

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
