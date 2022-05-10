import Link from 'next/link';
import { useRouter } from 'next/router';
import type { ReactElement } from 'react';
import ApplicationForm from 'components/application-form/ApplicationForm';
import useIsValidApplicationType from 'lib/application-form/useIsValidApplicationType';

export default (): ReactElement => {

    const router = useRouter();

    const { applicationType } = router.query as {applicationType?: string};

    if (applicationType === undefined) {
        return <div />;
    }

    const isValidApplicationType = useIsValidApplicationType(applicationType);

    if (!isValidApplicationType) {
        return <div className="text-red-500">hm..</div>;
    }

    return (
        <div className="min-h-full w-full md:w-2/3 mx-auto p-5">
            <div className="text-gray-400">
                <Link href="/bewerbung" passHref={true}>
                    <a>« zurück zur Übersicht</a>
                </Link>
            </div>

            <ApplicationForm applicationType={applicationType} />
        </div>
    );
};
