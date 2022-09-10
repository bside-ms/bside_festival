import type { ReactElement } from 'react';
import { useRegistrationFormContext } from 'components/artist/registration/RegistrationFormContext';

const RegistrationFormError = (): ReactElement | null => {

    const { formError } = useRegistrationFormContext();

    if (formError === null) {
        return null;
    }

    return (
        <div className="text-red-500 my-4">
            {formError}
        </div>
    );
};

export default RegistrationFormError;
