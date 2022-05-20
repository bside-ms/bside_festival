import { useCallback, useState } from 'react';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, FormHelperText } from '@mui/material';
import Image from 'next/image';
import type { ChangeEvent, ReactElement } from 'react';
import type ApplicationFormField from 'lib/application-form/ApplicationFormField';
import useApplicationFormContext from 'lib/application-form/useApplicationFormContext';

interface Props {
    formField: ApplicationFormField;
}

const ApplicationFormImageUploadField = ({ formField }: Props): ReactElement => {

    const { setFormValue, isSubmitting } = useApplicationFormContext();

    const [imageUploadPreview, setImageUploadPreview] = useState('');
    const [fieldError, setFieldError] = useState<string>();

    const isMandatory = formField.optional !== true;

    const onFileRead = useCallback((event: ProgressEvent<FileReader>): void => {

        const imageDataUrl = event.target?.result ?? null;

        if (typeof imageDataUrl === 'string') {
            setFormValue(formField.name, imageDataUrl);
            setImageUploadPreview(imageDataUrl);
        }
    }, [formField, setFormValue, setImageUploadPreview]);

    const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
        setFieldError(undefined);

        const fileReader = new FileReader();
        fileReader.addEventListener('load', onFileRead);

        // eslint-disable-next-line @typescript-eslint/prefer-optional-chain,@typescript-eslint/no-unnecessary-condition
        if (event.target.files !== null && event.target.files[0] !== undefined) {

            const imageFile = event.target.files[0];

            if (imageFile.size / 1000 / 1000 > 5) {
                setFieldError('Maximal 5 MB');
                return;
            }

            const allowedTypes = [
                'image/bmp',
                'image/jpeg',
                'image/tiff',
                'image/png',
            ];

            if (!allowedTypes.includes(imageFile.type)) {
                setFieldError('Ungültiges Bild-Format');
                return;
            }

            fileReader.readAsDataURL(imageFile);
        }
    }, [onFileRead, setFieldError]);

    const handleRemoveUpload = useCallback(() => {
        setFormValue(formField.name, '');
        setImageUploadPreview('');

    }, [formField, setFormValue]);

    return (
        <div className="relative">
            <input
                id={formField.name}
                name={formField.name}
                type="file"
                onChange={handleChange}
                accept="image/*"
                required={isMandatory}
                className="opacity-0 absolute w-[120px]"
            />

            <label htmlFor={formField.name}>
                <Button
                    variant="contained"
                    component="span"
                    disabled={isSubmitting}
                    startIcon={<FontAwesomeIcon icon={faCamera} />}
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

            {imageUploadPreview !== '' && (
                <>
                    <div className="mt-4 grow-0 relative h-32 w-full">
                        <Image
                            src={imageUploadPreview}
                            layout="fill"
                            objectFit="contain"
                            objectPosition="left"
                        />
                    </div>

                    <Button
                        onClick={handleRemoveUpload}
                        variant="text"
                        disabled={isSubmitting}
                    >
                        Bild entfernen
                    </Button>
                </>
            )}

            {fieldError !== undefined && (
                <div className="text-red-500 my-4">
                    {fieldError}
                </div>
            )}
        </div>
    );
};

export default ApplicationFormImageUploadField;
