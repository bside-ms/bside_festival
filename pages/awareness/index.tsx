import type { ReactElement } from 'react';
import AwarenessOverview from 'components/awareness/AwarenessOverview';
import Footer from 'components/common/Footer';
import NextHead from 'components/common/NextHead';
import PageHeader from 'components/common/PageHeader';

export default (): ReactElement => {

    return (
        <>
            <NextHead title="B-Side Festival 2022 - Awareness" />

            <PageHeader symbols="hearts" theme="yellowOnPink" />

            <AwarenessOverview />

            <Footer />
        </>
    );
};
