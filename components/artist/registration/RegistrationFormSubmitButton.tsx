import type { ReactElement } from 'react';
import { useRegistrationFormContext } from 'components/artist/registration/RegistrationFormContext';
import Button from 'components/common/Button';

const RegistrationFormSubmitButton = (): ReactElement => {

    const { isSubmitting } = useRegistrationFormContext();

    return (
        <Button
            type="submit"
            isDisabled={isSubmitting}
        >
            absenden
        </Button>
    );
};

export default RegistrationFormSubmitButton;
