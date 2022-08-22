import type { ReactElement } from 'react';
import Footer from 'components/common/Footer';
import NextHead from 'components/common/NextHead';
import PageHeader from 'components/common/PageHeader';
import RestrictedAccess from 'components/common/RestrictedAccess';
import VolunteersOverview from 'components/volunteers/overview/VolunteersOverview';

export default (): ReactElement | null => {

    return (
        <>
            <NextHead title="B-Side Festival 2022 - Helfer:innen" />

            <PageHeader theme="yellow" symbols="hearts" />

            <RestrictedAccess>
                <VolunteersOverview />
            </RestrictedAccess>

            <Footer />
        </>
    );
};
