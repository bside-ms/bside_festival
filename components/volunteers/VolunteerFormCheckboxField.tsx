import { useCallback } from 'react';
import { Checkbox } from '@mui/material';
import type { ReactElement, ReactNode, SyntheticEvent } from 'react';
import { useVolunteerFormContext } from 'components/volunteers/VolunteerFormContext';

interface Props {
    fieldName: string;
    children: ReactNode;
    onToggle: (fieldName: string, isChecked: boolean) => void;
}

const VolunteerFormCheckboxField = ({ children, fieldName, onToggle }: Props): ReactElement => {

    const { isSubmitting, formValues } = useVolunteerFormContext();

    const handleClick = useCallback((event: SyntheticEvent<HTMLButtonElement>) => {

        // Not sure why I have to cast that..
        onToggle(fieldName, (event.target as HTMLInputElement).checked);

    }, [fieldName, onToggle]);

    return (
        <div className="flex">
            <div>
                <Checkbox
                    id={fieldName}
                    sx={{ paddingY: 0, paddingX: 1 }}
                    disabled={isSubmitting}
                    onClick={handleClick}
                    checked={formValues.confirmedQuestions.split(';').includes(fieldName)}
                />
            </div>

            <div>
                <label htmlFor={fieldName}>
                    {children}
                </label>
            </div>
        </div>
    );
};

export default VolunteerFormCheckboxField;
