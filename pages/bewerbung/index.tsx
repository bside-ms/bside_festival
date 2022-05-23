import type { ReactElement } from 'react';
import ApplicationTypeCards from 'components/application-type-selection/ApplicationTypeCards';
import Footer from 'components/common/Footer';
import NextHead from 'components/common/NextHead';
import PageHeader from 'components/common/PageHeader';

export default (): ReactElement => {

    return (
        <>
            <NextHead title="B-Side Festival 2022 - Bewerbung" />

            <PageHeader theme="blue" />

            <ApplicationTypeCards />

            <Footer />
        </>
    );
};
