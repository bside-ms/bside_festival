import type { ReactElement } from 'react';
import ArtistsList from 'components/artists-list/ArtistsList';
import ContentWrapper from 'components/common/ContentWrapper';
import Footer from 'components/common/Footer';
import NextHead from 'components/common/NextHead';
import PageHeader from 'components/common/PageHeader';
import SwrResponseWrapper from 'components/strapi/SwrResponseWrapper';
import ApplicationType from 'lib/application-form/ApplicationType';
import useApplicationTitle from 'lib/application-form/useApplicationTitle';
import useAllArtists from 'lib/strapi/useAllArtists';

export default (): ReactElement => {

    const swrResponse = useAllArtists();

    return (
        <>
            <NextHead title="B-Side Festival 2022 - Künstler:innen" />

            <PageHeader theme="pink" symbols="hearts" />

            <div className="min-h-screen pt-[200px]">
                <ContentWrapper>
                    <SwrResponseWrapper response={swrResponse}>
                        {(response): ReactElement => (
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
                                    artists={response.exhibitionArtists}
                                    title={useApplicationTitle(ApplicationType.ausstellung)}
                                />
                                <ArtistsList
                                    artists={response.readingArtists}
                                    title={useApplicationTitle(ApplicationType.lesung)}
                                />
                                <ArtistsList
                                    artists={response.familyProgramOrganizers}
                                    title={useApplicationTitle(ApplicationType.familienprogramm)}
                                />
                            </div>
                        )}
                    </SwrResponseWrapper>
                </ContentWrapper>
            </div>

            <Footer />
        </>
    );
};
