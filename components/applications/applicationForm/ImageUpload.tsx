'use client';

import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Type } from '@prisma/client';
import bytes from 'bytes';
import type { ApplicationFormValues } from 'components/applications/applicationForm/ApplicationForm';
import blobToDataUrl from 'lib/common/helper/blobToDataUrl';
import cn from 'lib/common/helper/cn';
import isNotEmptyString from 'lib/common/helper/isNotEmptyString';
import allowedImageContentTypes from 'lib/upload/allowedImageContentTypes';
import allowedImageMaxFileSize from 'lib/upload/allowedImageMaxFileSize';
import { uniqueId } from 'lodash';
import { extension } from 'mime-types';
import Image from 'next/image';
import type { ChangeEvent, ReactElement } from 'react';
import { useCallback, useRef } from 'react';
import { useFormContext } from 'react-hook-form';

const fieldName: keyof ApplicationFormValues = 'encodedImage';

const typesRequiringImage = new Array<Type>(
    Type.Concert,
    Type.DiskJockey,
    Type.Performance,
    Type.Exhibition,
    Type.Reading,
    Type.FamilyProgram,
    Type.Workshop,
    Type.InfoBooth,
);

interface Props {
    chosenType: Type;
}

const ImageUpload = ({ chosenType }: Props): ReactElement => {
    const {
        register,
        setValue,
        formState: { errors, isSubmitting },
        watch,
        setError,
        clearErrors,
    } = useFormContext<ApplicationFormValues>();

    const required = typesRequiringImage.includes(chosenType);

    const errorMessage = errors[fieldName]?.message;

    const handleImageChange = useCallback(
        async ({ target }: ChangeEvent<HTMLInputElement>) => {
            clearErrors(fieldName);

            if (target.files === null || target.files[0] === undefined) {
                return;
            }

            const file = target.files[0];

            if (!allowedImageContentTypes.includes(file.type)) {
                setValue(fieldName, '');
                setError(fieldName, {
                    message: `Dateityp nicht zulässig, erlaubt sind ${allowedImageContentTypes

                        .map((type) => `.${extension(type)}`)
                        .join(', ')}`,
                });
                return;
            }

            if (file.size > allowedImageMaxFileSize) {
                setValue(fieldName, '');
                setError(fieldName, {
                    message: `Max. ${bytes.format(allowedImageMaxFileSize, { unitSeparator: '', unit: 'MB' })} zulässig`,
                });
                return;
            }

            const imageDataUrl = await blobToDataUrl(file);

            if (typeof imageDataUrl === 'string') {
                setValue(fieldName, imageDataUrl);
            }
        },
        [clearErrors, setError, setValue],
    );

    const handleImageDelete = useCallback(() => setValue(fieldName, ''), [setValue]);

    const currentImageDataUrl = watch(fieldName);

    const fileInputId = useRef(uniqueId('image-upload'));

    return (
        <div className="relative flex flex-col gap-1 text-white">
            {isNotEmptyString(currentImageDataUrl) && !isSubmitting && (
                <div
                    className="absolute top-1 right-1 z-10 cursor-pointer rounded-md bg-gray-800 px-2 py-1 text-sm text-gray-50 hover:bg-gray-700"
                    onClick={handleImageDelete}
                >
                    Entfernen&nbsp;&nbsp;&nbsp;
                    <FontAwesomeIcon className="inline-block w-4" icon={faTrashAlt} />
                </div>
            )}

            <input
                type="text"
                className="pointer-events-none h-0 opacity-0"
                tabIndex={-1}
                {...register(fieldName, {
                    required: {
                        value: required,
                        message: 'Dies ist ein Pflichtfeld',
                    },
                })}
            />

            <input
                id={fileInputId.current}
                type="file"
                onChange={handleImageChange}
                className="hidden"
                accept={allowedImageContentTypes.join(', ')}
                disabled={isSubmitting}
                tabIndex={-1}
            />

            <label htmlFor={fileInputId.current} className="cursor-pointer">
                {isNotEmptyString(currentImageDataUrl) ? (
                    <div className="relative h-24 w-full overflow-hidden">
                        <Image src={currentImageDataUrl} alt="Upload-Vorschau" fill={true} style={{ objectFit: 'contain' }} />
                    </div>
                ) : (
                    <div
                        className={cn(
                            'flex h-24 w-full items-center justify-center rounded border border-dashed border-white',
                            typeof errorMessage === 'string' && 'bg-rose-400',
                        )}
                    >
                        <div className={cn('text-white opacity-55', typeof errorMessage === 'string' && 'bg-rose-400 opacity-100')}>
                            {required ? 'Bild hinzufügen *' : 'Bild hinzufügen'}
                        </div>
                    </div>
                )}
            </label>

            {typeof errorMessage === 'string' && <div className="px-1 text-rose-600">{errorMessage}</div>}

            <div className="px-1 text-base text-white">
                Beachtet: Dieses Foto wird auf unserer Webseite veröffentlicht, falls ihr beim B-Side Festival dabei sein werdet.
            </div>
        </div>
    );
};

export default ImageUpload;
