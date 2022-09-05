import type { ReactElement } from 'react';
import Artist from 'components/artist/Artist';
import ContentWrapper from 'components/common/ContentWrapper';
import SwrResponseWrapper from 'components/strapi/SwrResponseWrapper';
import type ApplicationType from 'lib/application-form/ApplicationType';
import { LocationGroupsContextProvider } from 'lib/context/LocationGroupsContext';
import getCollectionTypeFromApplicationType from 'lib/program/getCollectionTypeFromApplicationType';
import type { default as ArtistModel } from 'lib/strapi/typings/Artist';
import type FullTimeProgramItem from 'lib/strapi/typings/FullTimeProgramItem';
import type ProgramItem from 'lib/strapi/typings/ProgramItem';
import useAllLocationGroups from 'lib/strapi/useAllLocationGroups';
import useArtist from 'lib/strapi/useArtist';
import useArtistProgram from 'lib/strapi/useArtistProgram';

interface Props {
    applicationType: ApplicationType;
    artistId: string;
}

const ArtistInfoWrapper = ({ applicationType, artistId }: Props): ReactElement => {

    const collectionType = getCollectionTypeFromApplicationType(applicationType);

    const artistResponse = useArtist(collectionType, artistId);
    const artistProgramResponse = useArtistProgram(collectionType, artistId);
    const allLocationGroupsResponse = useAllLocationGroups();

    return (
        <div className="pt-[250px] pb-20 bg-black">
            <ContentWrapper>
                <SwrResponseWrapper
                    response={allLocationGroupsResponse}
                >
                    {(allLocationGroups): ReactElement => (
                        <SwrResponseWrapper<Array<ArtistModel>> response={artistResponse}>
                            {(artists): ReactElement => (
                                <SwrResponseWrapper<Array<ProgramItem | FullTimeProgramItem>> response={artistProgramResponse}>
                                    {(artistProgramItems): ReactElement => (
                                        <LocationGroupsContextProvider locationGroups={allLocationGroups}>
                                            <Artist
                                                artist={artists[0]!}
                                                strapiCollectionType={collectionType}
                                                programItems={artistProgramItems}
                                            />
                                        </LocationGroupsContextProvider>
                                    )}
                                </SwrResponseWrapper>
                            )}
                        </SwrResponseWrapper>
                    )}
                </SwrResponseWrapper>
            </ContentWrapper>
        </div>
    );
};

export default ArtistInfoWrapper;
