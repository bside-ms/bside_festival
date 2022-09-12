import type { ReactElement } from 'react';
import Footer from 'components/common/Footer';
import NextHead from 'components/common/NextHead';
import PageHeader from 'components/common/PageHeader';
import RestrictedAccess from 'components/common/RestrictedAccess';
import RegistrationsOverviewWrapper from 'components/registrations/overview/RegistrationsOverviewWrapper';

export default (): ReactElement | null => {

    return (
        <>
            <NextHead title="B-Side Festival 2022 - Anmeldungen" />

            <PageHeader theme="yellow" symbols="hearts" />

            <RestrictedAccess>
                <RegistrationsOverviewWrapper />
            </RestrictedAccess>

            <Footer />
        </>
    );
};
