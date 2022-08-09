import type { ReactElement } from 'react';
import Footer from 'components/common/Footer';
import NextHead from 'components/common/NextHead';
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
            <NextHead title="B-Side Festival 2022 - Bewerbungsübersicht" />

            <div className="min-h-screen">
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
            </div>

            <Footer />
        </>
    );
};
