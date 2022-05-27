import { useSession } from 'next-auth/react';
import type { ReactElement } from 'react';
import ApplicationsOverview from 'components/applications/ApplicationsOverview';
import ApplicationsOverviewAlternative from 'components/applications/ApplicationsOverviewAlternative';
import Footer from 'components/common/Footer';
import NextHead from 'components/common/NextHead';
import PageHeader from 'components/common/PageHeader';

export default (): ReactElement => {

    const { status } = useSession();

    return (
        <>
            <NextHead title="B-Side Festival 2022 - Bewerbungsübersicht" />

            <PageHeader />

            {status === 'authenticated' ? (
                <ApplicationsOverview />
            ) : (
                <ApplicationsOverviewAlternative sessionStatus={status} />
            )}

            <Footer />
        </>
    );
};
