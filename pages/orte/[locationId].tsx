import { toNumber } from 'lodash';
import { useRouter } from 'next/router';
import type { ReactElement } from 'react';
import ContentWrapper from 'components/common/ContentWrapper';
import Footer from 'components/common/Footer';
import NextHead from 'components/common/NextHead';
import PageHeader from 'components/common/PageHeader';
import LocationsList from 'components/locations/LocationsList';
import SwrResponseWrapper from 'components/strapi/SwrResponseWrapper';
import { LocationGroupsContextProvider } from 'lib/context/LocationGroupsContext';
import useAllLocationGroups from 'lib/strapi/useAllLocationGroups';
import useAllLocations from 'lib/strapi/useAllLocations';

export default (): ReactElement | null => {

    const router = useRouter();
    const allLocationsResponse = useAllLocations();
    const allLocationGroupsResponse = useAllLocationGroups();

    const { locationId } = router.query as { locationId?: string };

    const parsedLocationId = toNumber(locationId);

    if (isNaN(parsedLocationId)) {
        return (
            <>
                <NextHead title="B-Side Festival 2022 - Orte" />

                <ContentWrapper>Whoops, da ging leider etwas schief!</ContentWrapper>

                <Footer />
            </>
        );
    }

    return (
        <>
            <NextHead title="B-Side Festival 2022 - Orte" />

            <PageHeader />

            <div className="bg-gray-800 min-h-screen">
                <div className="pt-[200px] pb-8 bg-gradient-to-b from-amber-100 to-pink-400">
                    <ContentWrapper>
                        <SwrResponseWrapper response={allLocationsResponse}>
                            {(allLocations): ReactElement => (
                                <SwrResponseWrapper response={allLocationGroupsResponse}>
                                    {(allLocationGroups): ReactElement => (
                                        <LocationGroupsContextProvider locationGroups={allLocationGroups}>
                                            <LocationsList
                                                allLocations={allLocations}
                                                locationId={parsedLocationId}
                                            />
                                        </LocationGroupsContextProvider>
                                    )}
                                </SwrResponseWrapper>
                            )}
                        </SwrResponseWrapper>
                    </ContentWrapper>
                </div>

                <Footer />
            </div>
        </>
    );
};
