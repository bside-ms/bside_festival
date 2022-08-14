import type { ReactElement } from 'react';
import Button from 'components/common/Button';
import { useVolunteerFormContext } from 'components/volunteers/VolunteerFormContext';

const VolunteerFormSubmitButton = (): ReactElement => {

    const { isSubmitting } = useVolunteerFormContext();

    return (
        <Button
            type="submit"
            isDisabled={isSubmitting}
        >
            absenden
        </Button>
    );
};

export default VolunteerFormSubmitButton;
