import { useRouter } from 'next/router';
import type { ReactElement } from 'react';
import ApplicationForm from 'components/application-form/ApplicationForm';
import ApplicationsOverview from 'components/applications/ApplicationsOverview';
import Footer from 'components/common/Footer';
import NextHead from 'components/common/NextHead';
import PageHeader from 'components/common/PageHeader';
import RestrictedAccess from 'components/common/RestrictedAccess';
import useIsValidApplicationType from 'lib/application-form/useIsValidApplicationType';

export default (): ReactElement | null => {

    const router = useRouter();

    const { applicationTypeOrId } = router.query as { applicationTypeOrId?: string };

    if (applicationTypeOrId === undefined) {
        return <div />;
    }

    const applicationId = parseInt(applicationTypeOrId, 10);

    if (isFinite(applicationId)) {

        return (
            <>
                <NextHead title="B-Side Festival 2022" />

                <PageHeader />

                <RestrictedAccess>
                    <ApplicationsOverview applicationId={applicationId} />
                </RestrictedAccess>

                <Footer />
            </>
        );
    }

    const isValidApplicationType = useIsValidApplicationType(applicationTypeOrId);

    if (!isValidApplicationType) {
        router.push('/bewerbung');
        return null;
    }

    return (
        <>
            <NextHead title="B-Side Festival 2022 - Bewerbung" />

            <ApplicationForm applicationType={applicationTypeOrId} />

            <Footer />
        </>
    );
};
