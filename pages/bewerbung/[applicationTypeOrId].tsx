import { useRouter } from 'next/router';
import type { ReactElement } from 'react';
import ApplicationForm from 'components/application-form/ApplicationForm';
import ApplicationTypeCards from 'components/application-type-selection/ApplicationTypeCards';
import ApplicationsOverviewWrapper from 'components/applications/ApplicationsOverviewWrapper';
import Footer from 'components/common/Footer';
import NextHead from 'components/common/NextHead';
import PageHeader from 'components/common/PageHeader';
import useIsValidApplicationType from 'lib/application-form/useIsValidApplicationType';

export default (): ReactElement => {

    const router = useRouter();

    const { applicationTypeOrId } = router.query as {applicationTypeOrId?: string};

    if (applicationTypeOrId === undefined) {
        return <div />;
    }

    const applicationId = parseInt(applicationTypeOrId, 10);

    if (isFinite(applicationId)) {

        return (
            <>
                <NextHead title="B-Side Festival 2022" />

                <PageHeader />

                <ApplicationsOverviewWrapper applicationId={applicationId} />

                <Footer />
            </>
        );
    }

    const isValidApplicationType = useIsValidApplicationType(applicationTypeOrId);

    if (!isValidApplicationType) {
        return (
            <>
                <NextHead title="B-Side Festival 2022 - Bewerbung" />

                <PageHeader theme="blue" />

                <ApplicationTypeCards />

                <Footer />
            </>
        );
    }

    return (
        <>
            <NextHead title="B-Side Festival 2022 - Bewerbung" />

            <ApplicationForm applicationType={applicationTypeOrId} />

            <Footer />
        </>
    );
};
