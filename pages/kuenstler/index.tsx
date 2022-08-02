import type { ReactElement } from 'react';
import ArtistsList from 'components/artists-list/ArtistsList';
import ContentWrapper from 'components/common/ContentWrapper';
import Footer from 'components/common/Footer';
import NextHead from 'components/common/NextHead';
import SwrResponseWrapper from 'components/strapi/SwrResponseWrapper';
import ApplicationType from 'lib/application-form/ApplicationType';
import useApplicationTitle from 'lib/application-form/useApplicationTitle';
import useAllArtists from 'lib/strapi/useAllArtists';

export default (): ReactElement => {

    const swrResponse = useAllArtists();

    return (
        <>
            <NextHead title="B-Side Festival 2022 - Bewerbungsübersicht" />

            <div className="min-h-screen">
                <SwrResponseWrapper response={swrResponse}>
                    {(response): ReactElement => (
                        <ContentWrapper>
                            <div className="my-5 space-y-9">
                                <ArtistsList
                                    artists={response.concertArtists}
                                    title={useApplicationTitle(ApplicationType.konzert)}
                                />
                                <ArtistsList
                                    artists={response.performanceArtists}
                                    title={useApplicationTitle(ApplicationType.performance)}
                                />
                                <ArtistsList
                                    artists={response.workshopsOrganizers}
                                    title={useApplicationTitle(ApplicationType.workshop)}
                                />
                                <ArtistsList
                                    artists={response.readingArtists}
                                    title={useApplicationTitle(ApplicationType.lesung)}
                                />
                                <ArtistsList
                                    artists={response.familyProgramOrganizer}
                                    title={useApplicationTitle(ApplicationType.familienprogramm)}
                                />
                            </div>
                        </ContentWrapper>
                    )}
                </SwrResponseWrapper>
            </div>

            <Footer />
        </>
    );
};
