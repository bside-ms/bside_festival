import { useCallback, useState } from 'react';
import { Button } from '@mui/material';
import Image from 'next/image';
import type { ChangeEvent, ReactElement } from 'react';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type ApplicationFormField from 'lib/application-form/ApplicationFormField';
import useApplicationFormContext from 'lib/application-form/useApplicationFormContext';

interface Props {
    formField: ApplicationFormField;
}

const ApplicationFormImageUploadField = ({ formField }: Props): ReactElement => {

    const { setFormValue, isSubmitting } = useApplicationFormContext();

    const [imageUploadPreview, setImageUploadPreview] = useState<string>('');

    const onFileRead = useCallback((event: ProgressEvent<FileReader>): void => {

        const imageDataUrl = event.target?.result ?? null;

        if (typeof imageDataUrl === 'string') {
            setFormValue(formField.name, imageDataUrl);
            setImageUploadPreview(imageDataUrl);
        }
    }, [formField, setFormValue, setImageUploadPreview]);

    const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
        const fileReader = new FileReader();
        fileReader.addEventListener('load', onFileRead);

        // eslint-disable-next-line @typescript-eslint/prefer-optional-chain,@typescript-eslint/no-unnecessary-condition
        if (event.target.files !== null && event.target.files[0] !== undefined) {
            fileReader.readAsDataURL(event.target.files[0]);
        }
    }, [onFileRead]);

    const handleRemoveUpload = useCallback(() => {
        setFormValue(formField.name, '');
        setImageUploadPreview('');

    }, [formField, setFormValue]);

    return (
        <div>
            <input
                id={formField.name}
                type="file"
                onChange={handleChange}
                hidden={true}
                accept="image/*"
            />

            <label htmlFor={formField.name}>
                <Button
                    variant="contained"
                    component="span"
                    disabled={isSubmitting}
                    startIcon={<FontAwesomeIcon icon={faCamera} />}
                >
                    {formField.label}
                </Button>
            </label>

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
        </div>
    );
};

export default ApplicationFormImageUploadField;
