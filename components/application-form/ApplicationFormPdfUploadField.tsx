import { useCallback, useState } from 'react';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, FormHelperText } from '@mui/material';
import type { ChangeEvent, ReactElement } from 'react';
import type ApplicationFormField from 'lib/application-form/ApplicationFormField';
import useApplicationFormContext from 'lib/application-form/useApplicationFormContext';

interface Props {
    formField: ApplicationFormField;
}

const ApplicationFormPdfUploadField = ({ formField }: Props): ReactElement => {

    const { setFormValue, isSubmitting } = useApplicationFormContext();

    const [pdfFileNamePreview, setPdfFileNamePreview] = useState('');
    const [fieldError, setFieldError] = useState<string>();

    const isMandatory = formField.optional !== true;

    const onFileRead = useCallback((event: ProgressEvent<FileReader>): void => {

        const pdfDataUrl = event.target?.result ?? null;

        if (typeof pdfDataUrl === 'string') {
            setFormValue(formField.name, pdfDataUrl);
        }
    }, [formField, setFormValue]);

    const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
        setFieldError(undefined);

        const fileReader = new FileReader();
        fileReader.addEventListener('load', onFileRead);

        if (event.target.files?.[0] !== undefined) {

            const pdfFile = event.target.files[0];

            if (pdfFile.size / 1000 / 1000 > 5) {
                setFieldError('Maximal 5 MB');
                return;
            }

            const allowedTypes = [
                'application/pdf',
            ];

            if (!allowedTypes.includes(pdfFile.type)) {
                setFieldError('Ungültiges Datei-Format');
                return;
            }

            setPdfFileNamePreview(pdfFile.name);

            fileReader.readAsDataURL(pdfFile);
        }
    }, [onFileRead, setFieldError]);

    const handleRemoveUpload = useCallback(() => {
        setFormValue(formField.name, '');
        setPdfFileNamePreview('');

    }, [formField, setFormValue]);

    return (
        <div className="relative">
            <input
                id={formField.name}
                name={formField.name}
                type="file"
                onChange={handleChange}
                accept="application/pdf"
                required={isMandatory}
                className="opacity-0 absolute w-[120px]"
            />

            <label htmlFor={formField.name}>
                <Button
                    variant="contained"
                    component="span"
                    disabled={isSubmitting}
                    startIcon={<FontAwesomeIcon icon={faFilePdf} />}
                >
                    {formField.label} {isMandatory && '*'}
                </Button>
            </label>

            {formField.info !== undefined && (
                <div className="mx-[14px]">
                    <FormHelperText>
                        {formField.info}
                    </FormHelperText>
                </div>
            )}

            {pdfFileNamePreview !== '' && (
                <div className="mt-4">
                    <div className="truncate">
                        {pdfFileNamePreview}
                    </div>

                    <Button
                        onClick={handleRemoveUpload}
                        variant="text"
                        disabled={isSubmitting}
                        className="whitespace-nowrap"
                    >
                        PDF entfernen
                    </Button>
                </div>
            )}

            {fieldError !== undefined && (
                <div className="text-red-500 my-4">
                    {fieldError}
                </div>
            )}
        </div>
    );
};

export default ApplicationFormPdfUploadField;
