import { useCallback, useRef } from 'react';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import bytes from 'bytes';
import { uniqueId } from 'lodash';
import { extension } from 'mime-types';
import Image from 'next/image';
import type { ChangeEvent, ReactElement } from 'react';
import { useFormContext } from 'react-hook-form';
import type { ApplicationFormValues } from 'components/applications/applicationForm/ApplicationForm';
import blobToDataUrl from 'lib/common/helper/blobToDataUrl';
import isNotEmptyString from 'lib/common/helper/isNotEmptyString';

interface Props {
    required?: boolean;
}

const fieldName: keyof ApplicationFormValues = 'encodedImage';

const maxFileSize = bytes('1MB'); // TODO

const allowedTypes = [
    'image/bmp',
    'image/jpeg',
    'image/tiff',
    'image/png',
];

const ImageUpload = ({ required = false }: Props): ReactElement => {

    const { register, setValue, formState, watch, setError, clearErrors } = useFormContext<ApplicationFormValues>();

    const errorMessage = formState.errors[fieldName]?.message;

    console.log('errorMessage', errorMessage);

    const handleImageChange = useCallback(async ({ target }: ChangeEvent<HTMLInputElement>) => {

        clearErrors(fieldName);

        if (target.files === null || target.files[0] === undefined) {
            return;
        }

        const file = target.files[0];

        if (!allowedTypes.includes(file.type)) {
            setValue(fieldName, '');
            setError(
                fieldName,
                {
                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                    message: `Dateityp nicht zulässig, erlaubt sind ${allowedTypes.map(type => `.${extension(type)}`).join(', ')}`,
                }
            );
            return;
        }

        if (file.size > maxFileSize) {
            setValue(fieldName, '');
            setError(
                fieldName,
                {
                    message: `Max. ${bytes.format(maxFileSize, { unitSeparator: '', unit: 'MB' })} zulässig`,
                }
            );
            return;
        }

        const imageDataUrl = await blobToDataUrl(file);

        if (typeof imageDataUrl === 'string') {
            setValue(fieldName, imageDataUrl);
        }

    }, [clearErrors, setError, setValue]);

    const handleImageDelete = useCallback(
        () => setValue(fieldName, ''),
        [setValue]
    );

    const currentImageDataUrl = watch(fieldName);

    const fileInputId = useRef(uniqueId('image-upload'));

    return (
        <div className="flex flex-col gap-1 relative text-gray-100">
            {isNotEmptyString(currentImageDataUrl) && (
                <div
                    className="absolute right-1 top-1 py-1 px-2 bg-gray-800 hover:bg-gray-700 text-gray-50 text-sm rounded-md cursor-pointer z-10"
                    onClick={handleImageDelete}
                >
                    Entfernen&nbsp;&nbsp;&nbsp;<FontAwesomeIcon icon={faTrashAlt} />
                </div>
            )}

            <input
                type="hidden"
                {...register(
                    fieldName,
                    {
                        required: {
                            value: required,
                            message: 'Dies ist ein Pflichtfeld',
                        },
                    }
                )}
            />

            <input
                id={fileInputId.current}
                type="file"
                onChange={handleImageChange}
                className="hidden"
                accept={allowedTypes.join(', ')}
            />

            <label htmlFor={fileInputId.current} className="cursor-pointer">
                {isNotEmptyString(currentImageDataUrl) ? (
                    <div className="relative w-full h-24 overflow-hidden">
                        <Image src={currentImageDataUrl} alt="foo" fill={true} style={{ objectFit: 'contain' }} />
                    </div>
                ) : (
                    <div className={`h-24 w-full border border-dashed border-gray-100 flex justify-center items-center rounded ${typeof errorMessage === 'string' ? 'bg-rose-700' : ''}`}>
                        {required ? 'Bild hinzufügen *' : 'Bild hinzufügen'}
                    </div>
                )}
            </label>

            {typeof errorMessage === 'string' && (
                <div className="px-1 text-rose-600">
                    {errorMessage}
                </div>
            )}

            <div className="px-1 text-gray-100 text-base">
                Dieses Foto wird auf unserer Webseite
                veröffentlicht, falls ihr beim B-Side Festival
                dabei sein werdet. Bitte sendet nur neutrale Fotos
                ohne Text & Logos.
            </div>
        </div>
    );
};

export default ImageUpload;
