import type { ReactElement } from 'react';
import useApplicationFormContext from 'lib/application-form/useApplicationFormContext';

const ApplicationFormError = (): ReactElement | null => {

    const { formError } = useApplicationFormContext();

    if (formError === null) {
        return null;
    }

    return (
        <div className="text-red-500 my-4">
            {formError}
        </div>
    );
};

export default ApplicationFormError;
