import type { ReactElement } from 'react';
import { Button, styled, TextField } from '@mui/material';
import type { ApplicationField } from 'lib/ApplicationFormService';
import { FieldType } from 'lib/ApplicationFormService';

interface Props {
    formField: ApplicationField;
}

const ApplicationFormField = ({ formField }: Props): ReactElement => {

    switch (formField.type) {
        case FieldType.text:
            return (
                <TextField
                    fullWidth={true}
                    label={formField.label}
                    name={formField.name}
                    required={formField.mandatory}
                />
            );

        case FieldType.textArea:

            return (
                <TextField
                    fullWidth={true}
                    label={formField.label}
                    name={formField.name}
                    required={formField.mandatory}
                    multiline={true}
                />
            );

        case FieldType.upload: {

            const Input = styled('input')({ display: 'none' });

            return (
                <label htmlFor={formField.name}>
                    <Input id={formField.name} type="file" />
                    <Button variant="contained" component="span">
                        {formField.label}
                    </Button>
                </label>
            );
        }
    }
};

export default ApplicationFormField;
