import type { ReactElement } from 'react';
import ApplicationFormField from 'components/application-form/ApplicationFormField';
import type { ApplicationType } from 'lib/ApplicationFormService';
import { useApplicationFields } from 'lib/ApplicationFormService';

interface Props {
    currentType: ApplicationType;
}

const ApplicationFormFields = ({ currentType }: Props): ReactElement => {

    const applicationFields = useApplicationFields(currentType);

    return (
        <div className="space-y-5">
            {applicationFields.map(field => (
                <ApplicationFormField
                    key={field.name}
                    formField={field}
                />
            ))}
        </div>
    );
};

export default ApplicationFormFields;
