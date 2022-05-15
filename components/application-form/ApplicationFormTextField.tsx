import { useCallback } from 'react';
import { TextField } from '@mui/material';
import type { ChangeEvent, ReactElement } from 'react';
import type ApplicationFormField from 'lib/application-form/ApplicationFormField';
import useApplicationFormContext from 'lib/application-form/useApplicationFormContext';

interface Props {
    formField: ApplicationFormField;
}

const ApplicationFormTextField = ({ formField }: Props): ReactElement => {

    const { setFormValue, isSubmitting } = useApplicationFormContext();

    const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
        setFormValue(event.target.name, event.target.value);
    }, [setFormValue]);

    return (
        <TextField
            fullWidth={true}
            label={formField.label}
            name={formField.name}
            onChange={handleChange}
            required={formField.mandatory}
            helperText={formField.info}
            disabled={isSubmitting}
        />
    );
};

export default ApplicationFormTextField;
