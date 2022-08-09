import type { ReactElement } from 'react';
import Footer from 'components/common/Footer';
import NextHead from 'components/common/NextHead';
import LocationsList from 'components/locations/LocationsList';
import SwrResponseWrapper from 'components/strapi/SwrResponseWrapper';
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
                                <LocationsList
                                    allLocations={allLocations}
                                    allLocationGroups={allLocationGroups}
                                />
                            )}
                        </SwrResponseWrapper>
                    )}
                </SwrResponseWrapper>
            </div>

            <Footer />
        </>
    );
};
