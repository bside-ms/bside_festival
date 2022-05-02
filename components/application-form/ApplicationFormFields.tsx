import type { ReactElement } from 'react';
import ApplicationFormField from 'components/application-form/ApplicationFormField';
import type ApplicationType from 'lib/application-form/ApplicationType';
import { useApplicationFormFields } from 'lib/application-form/useApplicationFormFields';

interface Props {
    currentApplicationType: ApplicationType;
}

const ApplicationFormFields = ({ currentApplicationType }: Props): ReactElement => {

    const applicationFields = useApplicationFormFields(currentApplicationType);

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
