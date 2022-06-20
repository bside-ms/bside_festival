import type { ReactElement } from 'react';
import Footer from 'components/common/Footer';
import NextHead from 'components/common/NextHead';
import ConcertArtistsList from 'components/concert-artists/ConcertArtistsList';
import useAllConcertArtists from 'lib/strapi/useAllConcertArtists';

export default (): ReactElement => {

    const { data, error } = useAllConcertArtists();

    return (
        <>
            <NextHead title="B-Side Festival 2022 - Bewerbungsübersicht" />

            <div className="min-h-screen">
                <ConcertArtistsList data={data} error={error} />
            </div>

            <Footer />
        </>
    );
};
