import { Checkbox } from '@mui/material';
import type { ReactElement, ReactNode } from 'react';
import useApplicationFormContext from 'lib/application-form/useApplicationFormContext';

interface Props {
    name: string;
    children: ReactNode;
}

const ApplicationFormMandatoryCheckbox = ({ name, children }: Props): ReactElement => {

    const { isSubmitting } = useApplicationFormContext();

    return (
        <div className="flex">
            <div>
                <Checkbox
                    id={name}
                    required={true}
                    sx={{ paddingY: 0, paddingX: 1 }}
                    disabled={isSubmitting}
                />
            </div>

            <div>
                <label htmlFor={name}>
                    {children} *
                </label>
            </div>
        </div>
    );
};

export default ApplicationFormMandatoryCheckbox;
