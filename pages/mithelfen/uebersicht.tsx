import type { ReactElement } from 'react';
import Footer from 'components/common/Footer';
import NextHead from 'components/common/NextHead';
import PageHeader from 'components/common/PageHeader';

export default (): ReactElement | null => {

    return (
        <>
            <NextHead title="B-Side Festival 2022 - Helfer:innen" />

            <PageHeader theme="yellow" symbols="hearts" />

            <Footer />
        </>
    );
};
