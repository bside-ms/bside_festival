import { type ChangeEvent, type ReactElement, useCallback } from 'react';
import { TextField } from '@mui/material';
import type { VolunteerFormValues } from './volunteerForm/VolunteerForm';

interface Props {
    fieldName: keyof VolunteerFormValues;
    label: string;
    helperText?: string;
    isOptional?: boolean;
}

const VolunteerFormTextField = ({ fieldName, label, helperText, isOptional = false }: Props): ReactElement => {
    
    const { setFormValue, isSubmitting } = useState(false);

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
