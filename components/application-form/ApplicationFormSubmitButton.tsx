import { Button } from '@mui/material';
import type { ReactElement } from 'react';
import useApplicationFormContext from 'lib/application-form/useApplicationFormContext';

const ApplicationFormSubmitButton = (): ReactElement => {

    const { isSubmitting } = useApplicationFormContext();

    return (
        <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
        >
            Bewerbung absenden
        </Button>
    );
};

export default ApplicationFormSubmitButton;
