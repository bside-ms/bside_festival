import type { ReactElement } from 'react';
import ApplicationsOverviewWrapper from 'components/applications/ApplicationsOverviewWrapper';
import Footer from 'components/common/Footer';
import NextHead from 'components/common/NextHead';
import PageHeader from 'components/common/PageHeader';

export default (): ReactElement => {

    return (
        <>
            <NextHead title="B-Side Festival 2022 - Bewerbungsübersicht" />

            <PageHeader />

            <ApplicationsOverviewWrapper />

            <Footer />
        </>
    );
};
