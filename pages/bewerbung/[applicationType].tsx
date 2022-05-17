import { useRouter } from 'next/router';
import type { ReactElement } from 'react';
import ApplicationForm from 'components/application-form/ApplicationForm';
import Footer from 'components/common/Footer';
import useIsValidApplicationType from 'lib/application-form/useIsValidApplicationType';

export default (): ReactElement => {

    const router = useRouter();

    const { applicationType } = router.query as {applicationType?: string};

    const isValidApplicationType = useIsValidApplicationType(applicationType);

    if (!isValidApplicationType) {
        return <div />;
    }

    return (
        <>
            <ApplicationForm applicationType={applicationType} />

            <Footer />
        </>
    );
};
