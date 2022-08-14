import { useCallback } from 'react';
import { TextField } from '@mui/material';
import type { ChangeEvent, ReactElement } from 'react';
import type { VolunteerFormValues } from 'components/volunteers/VolunteerFormContext';
import { useVolunteerFormContext } from 'components/volunteers/VolunteerFormContext';

interface Props {
    fieldName: keyof VolunteerFormValues;
    label: string;
    helperText?: string;
    isOptional?: boolean;
}

const VolunteerFormTextField = ({ fieldName, label, helperText, isOptional = false }: Props): ReactElement => {

    const { setFormValue, isSubmitting } = useVolunteerFormContext();

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
        />
    );
};

export default VolunteerFormTextField;
