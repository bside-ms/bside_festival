import Link from 'next/link';
import type { ReactElement } from 'react';
import ApplicationFormFields from 'components/application-form/ApplicationFormFields';
import type { ApplicationType } from 'lib/ApplicationFormService';

interface Props {
    applicationType: ApplicationType;
}

const ApplicationForm = ({ applicationType }: Props): ReactElement => {

    return (
        <div className="w-full p-2 mt-4 bg-white">
            <div>
                <Link href="/bewerbung" passHref={true}>
                    <a>Zurück</a>
                </Link>
            </div>

            <ApplicationFormFields currentType={applicationType} />
        </div>
    );
};

export default ApplicationForm;
