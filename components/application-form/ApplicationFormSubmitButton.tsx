import type { ReactElement } from 'react';
import Button from 'components/common/Button';
import useApplicationFormContext from 'lib/application-form/useApplicationFormContext';

const ApplicationFormSubmitButton = (): ReactElement => {

    const { isSubmitting } = useApplicationFormContext();

    return (
        <Button
            type="submit"
            isDisabled={isSubmitting}
        >
            Bewerbung absenden
        </Button>
    );
};

export default ApplicationFormSubmitButton;
