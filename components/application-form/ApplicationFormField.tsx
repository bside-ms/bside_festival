import type { ReactElement } from 'react';
import ApplicationFormImageUploadField from 'components/application-form/ApplicationFormImageUploadField';
import ApplicationFormPdfUploadField from 'components/application-form/ApplicationFormPdfUploadField';
import ApplicationFormTextAreaField from 'components/application-form/ApplicationFormTextAreaField';
import ApplicationFormTextField from 'components/application-form/ApplicationFormTextField';
import ApplicationFormField from 'lib/application-form/ApplicationFormField';
import ApplicationFormFieldType from 'lib/application-form/ApplicationFormFieldType';

interface Props {
    formField: ApplicationFormField;
}

const ApplicationFormField = ({ formField }: Props): ReactElement => {

    switch (formField.type) {
        case ApplicationFormFieldType.text:
            return <ApplicationFormTextField formField={formField} />;

        case ApplicationFormFieldType.textArea:
            return <ApplicationFormTextAreaField formField={formField} />;

        case ApplicationFormFieldType.imageUpload:
            return <ApplicationFormImageUploadField formField={formField} />;

        case ApplicationFormFieldType.pdfUpload:
            return <ApplicationFormPdfUploadField formField={formField} />;
    }
};

export default ApplicationFormField;
