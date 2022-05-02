import { useRouter } from 'next/router';
import type { ReactElement } from 'react';
import ApplicationForm from 'components/application-form/ApplicationForm';
import useIsValidApplicationType from 'lib/application-form/useIsValidApplicationType';

export default (): ReactElement => {

    const router = useRouter();

    const { applicationType } = router.query as {applicationType: string};

    const isValidApplicationType = useIsValidApplicationType(applicationType);

    if (!isValidApplicationType) {
        return <div className="text-red-500">hm..</div>;
    }

    return <ApplicationForm applicationType={applicationType} />;
};
