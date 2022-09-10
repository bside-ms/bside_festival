import { useCallback } from 'react';
import { TextField } from '@mui/material';
import type { ChangeEvent, ComponentProps, ReactElement } from 'react';
import type { RegistrationFormValues } from 'components/artist/registration/RegistrationFormContext';
import { useRegistrationFormContext } from 'components/artist/registration/RegistrationFormContext';

interface Props {
    fieldName: keyof RegistrationFormValues;
    label: string;
    type?: ComponentProps<typeof TextField>['type'];
    helperText?: string;
    isOptional?: boolean;
}

const RegistrationFormTextField = ({ fieldName, label, helperText, type, isOptional = false }: Props): ReactElement => {

    const { setFormValue, isSubmitting } = useRegistrationFormContext();

    const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
        setFormValue(fieldName, event.target.value);
    }, [fieldName, setFormValue]);

    return (
        <TextField
            fullWidth={true}
            label={label}
            name={fieldName}
            onChange={handleChange}
            required={!isOptional}
            disabled={isSubmitting}
            helperText={helperText}
            type={type}
        />
    );
};

export default RegistrationFormTextField;
