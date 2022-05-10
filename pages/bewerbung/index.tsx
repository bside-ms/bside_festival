import Link from 'next/link';
import type { ReactElement } from 'react';
import ApplicationTypeCard from 'components/application-form/ApplicationTypeCard';
import ApplicationType from 'lib/application-form/ApplicationType';

export default (): ReactElement => {

    return (
        <div className="min-h-full w-full md:w-2/3 mx-auto p-5">
            <div className="text-gray-400 mb-3">
                <Link href="/" passHref={true}>
                    <a>« zurück</a>
                </Link>
            </div>

            {Object.values(ApplicationType).map(applicationType => (
                <ApplicationTypeCard
                    key={applicationType}
                    applicationType={applicationType}
                />
            ))}
        </div>
    );
};
