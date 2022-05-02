import { Button, styled, TextField } from '@mui/material';
import type { ReactElement } from 'react';
import ApplicationFormField from 'lib/application-form/ApplicationFormField';
import ApplicationFormFieldType from 'lib/application-form/ApplicationFormFieldType';

interface Props {
    formField: ApplicationFormField;
}

const ApplicationFormField = ({ formField }: Props): ReactElement => {

    switch (formField.type) {
        case ApplicationFormFieldType.text:
            return (
                <TextField
                    fullWidth={true}
                    label={formField.label}
                    name={formField.name}
                    required={formField.mandatory}
                />
            );

        case ApplicationFormFieldType.textArea:

            return (
                <TextField
                    fullWidth={true}
                    label={formField.label}
                    name={formField.name}
                    required={formField.mandatory}
                    multiline={true}
                    minRows={4}
                />
            );

        case ApplicationFormFieldType.upload: {

            const Input = styled('input')({ display: 'none' });

            return (
                <div>
                    <label htmlFor={formField.name}>
                        <Input id={formField.name} type="file" />
                        <Button variant="contained" component="span">
                            {formField.label}
                        </Button>
                    </label>
                </div>
            );
        }
    }
};

export default ApplicationFormField;
