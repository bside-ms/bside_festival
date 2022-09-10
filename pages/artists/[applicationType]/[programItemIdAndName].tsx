import { useRouter } from 'next/router';
import type { ReactElement } from 'react';
import ArtistInfoWrapper from 'components/artist/ArtistInfoWrapper';
import Footer from 'components/common/Footer';
import NextHead from 'components/common/NextHead';
import PageHeader from 'components/common/PageHeader';
import type ApplicationType from 'lib/application-form/ApplicationType';

export default (): ReactElement | null => {

    const router = useRouter();

    const { applicationType, programItemIdAndName } = router.query as { applicationType?: string, programItemIdAndName?: string };

    if (applicationType === undefined || programItemIdAndName === undefined) {
        return (
            <>
                <NextHead title="B-Side Festival 2022" />

                <div>Whoops, da ging leider etwas schief!</div>

                <Footer />
            </>
        );
    }

    const artistId = programItemIdAndName.split('-')[0] ?? null;

    if (artistId === null) {
        return (
            <>
                <NextHead title="B-Side Festival 2022" />

                <div>Whoops, da ging leider etwas schief!</div>

                <Footer />
            </>
        );
    }

    return (
        <>
            <NextHead title="B-Side Festival 2022" />

            <PageHeader />

            <div className="bg-gray-800 min-h-screen">
                <ArtistInfoWrapper
                    applicationType={applicationType as ApplicationType}
                    artistId={artistId}
                />

                <Footer />
            </div>
        </>
    );
};
