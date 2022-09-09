import type { ReactElement } from 'react';
import ArtistsList from 'components/artists-list/ArtistsList';
import ContentWrapper from 'components/common/ContentWrapper';
import Footer from 'components/common/Footer';
import NextHead from 'components/common/NextHead';
import PageHeader from 'components/common/PageHeader';
import SwrResponseWrapper from 'components/strapi/SwrResponseWrapper';
import ApplicationType from 'lib/application-form/ApplicationType';
import getTitleForApplicationType from 'lib/application-form/getTitleForApplicationType';
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
                                    title={getTitleForApplicationType(ApplicationType.konzert)}
                                />
                                <ArtistsList
                                    artists={response.performanceArtists}
                                    title={getTitleForApplicationType(ApplicationType.performance)}
                                />
                                <ArtistsList
                                    artists={response.workshopsOrganizers}
                                    title={getTitleForApplicationType(ApplicationType.workshop)}
                                />
                                <ArtistsList
                                    artists={response.exhibitionArtists}
                                    title={getTitleForApplicationType(ApplicationType.ausstellung)}
                                />
                                <ArtistsList
                                    artists={response.readingArtists}
                                    title={getTitleForApplicationType(ApplicationType.lesung)}
                                />
                                <ArtistsList
                                    artists={response.familyProgramOrganizers}
                                    title={getTitleForApplicationType(ApplicationType.familienprogramm)}
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
