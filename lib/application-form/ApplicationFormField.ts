import type ApplicationFormFieldType from 'lib/application-form/ApplicationFormFieldType';

interface ApplicationFormField {
    name: string;
    type: ApplicationFormFieldType;
    label: string;
    mandatory?: boolean;
    info?: string;
}

export default ApplicationFormField;
