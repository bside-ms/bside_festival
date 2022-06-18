import type { ReactElement } from 'react';
import Footer from 'components/common/Footer';
import NextHead from 'components/common/NextHead';
import LocationsList from 'components/locations/LocationsList';
import useAllLocations from 'lib/strapi/useAllLocations';

export default (): ReactElement => {

    const { data, error } = useAllLocations();

    return (
        <>
            <NextHead title="B-Side Festival 2022 - Bewerbungsübersicht" />

            <div className="min-h-screen">
                <LocationsList data={data} error={error} />
            </div>

            <Footer />
        </>
    );
};
