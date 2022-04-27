import { useRouter } from 'next/router';
import type { ReactElement } from 'react';
import ApplicationForm from 'components/application-form/ApplicationForm';
import { getApplicationTypeByPathPart } from 'lib/ApplicationFormService';

export default (): ReactElement => {

    const router = useRouter();

    const { pathPart } = router.query as {pathPart: string};

    const applicationType = getApplicationTypeByPathPart(pathPart);

    if (applicationType === undefined) {
        return <div className="text-red-500">hm..</div>;
    }

    return <ApplicationForm applicationType={applicationType} />;
};
