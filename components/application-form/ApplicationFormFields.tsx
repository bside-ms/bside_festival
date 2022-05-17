import type { ReactElement } from 'react';
import ApplicationFormField from 'components/application-form/ApplicationFormField';
import ApplicationFormMandatoryCheckboxes from 'components/application-form/ApplicationFormMandatoryCheckboxes';
import type ApplicationType from 'lib/application-form/ApplicationType';
import { useApplicationFormFields } from 'lib/application-form/useApplicationFormFields';

interface Props {
    currentApplicationType: ApplicationType;
}

const ApplicationFormFields = ({ currentApplicationType }: Props): ReactElement => {

    const applicationFields = useApplicationFormFields(currentApplicationType);

    return (
        <div className="space-y-5 md:max-w-[550px]">
            {applicationFields.map(field => (
                <ApplicationFormField
                    key={field.name}
                    formField={field}
                />
            ))}

            <ApplicationFormMandatoryCheckboxes />
        </div>
    );
};

export default ApplicationFormFields;
