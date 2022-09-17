import type { ReactElement } from 'react';
import ContentWrapper from 'components/common/ContentWrapper';
import Footer from 'components/common/Footer';
import NextHead from 'components/common/NextHead';
import PageAlert from 'components/common/PageAlert';
import PageHeader from 'components/common/PageHeader';
import LocationsList from 'components/locations/LocationsList';
import SwrResponseWrapper from 'components/strapi/SwrResponseWrapper';
import { LocationGroupsContextProvider } from 'lib/context/LocationGroupsContext';
import useAllLocationGroups from 'lib/strapi/useAllLocationGroups';
import useAllLocations from 'lib/strapi/useAllLocations';

export default (): ReactElement => {

    const allLocationsResponse = useAllLocations();
    const allLocationGroupsResponse = useAllLocationGroups();

    return (
        <>
            <NextHead title="B-Side Festival 2022 - Orte" />

            <PageAlert />

            <PageHeader theme="blue" symbols="hearts" />

            <div className="pt-[200px] pb-8 min-h-screen bg-gradient-to-b from-amber-100 to-pink-400">
                <ContentWrapper>
                    <SwrResponseWrapper response={allLocationsResponse}>
                        {(allLocations): ReactElement => (
                            <SwrResponseWrapper response={allLocationGroupsResponse}>
                                {(allLocationGroups): ReactElement => (
                                    <LocationGroupsContextProvider locationGroups={allLocationGroups}>
                                        <LocationsList
                                            allLocations={allLocations}
                                        />
                                    </LocationGroupsContextProvider>
                                )}
                            </SwrResponseWrapper>
                        )}
                    </SwrResponseWrapper>
                </ContentWrapper>
            </div>

            <Footer />
        </>
    );
};
