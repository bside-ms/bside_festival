import { useCallback, useState } from 'react';
import type { ReactElement } from 'react';
import ApplicationFormFields from 'components/application-form/ApplicationFormFields';
import ApplicationFormSelect from 'components/application-form/ApplicationFormSelect';
import type { ApplicationType } from 'lib/ApplicationFormService';

const ApplicationForm = (): ReactElement => {

    const [applicationType, setApplicationType] = useState<ApplicationType>();

    const handleTypeChange = useCallback((type: ApplicationType) => {
        setApplicationType(type);
    }, []);

    return (
        <div className="w-full p-2 mt-4 text-cyan-50 bg-white">
            <ApplicationFormSelect currentType={applicationType} onTypeChange={handleTypeChange} />

            {applicationType !== undefined && (
                <div className="mt-5">
                    <ApplicationFormFields currentType={applicationType} />
                </div>
            )}
        </div>
    );
};

export default ApplicationForm;
