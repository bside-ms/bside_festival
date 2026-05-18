import { deleteApplicationImage, replaceApplicationImage } from '@/lib/actions/applicationActions';
import blobToDataUrl from '@/lib/common/helper/blobToDataUrl';
import cn from '@/lib/common/helper/cn';
import isEmptyString from '@/lib/common/helper/isEmptyString';
import isNotEmptyString from '@/lib/common/helper/isNotEmptyString';
import allowedImageContentTypes from '@/lib/upload/allowedImageContentTypes';
import allowedImageMaxFileSize from '@/lib/upload/allowedImageMaxFileSize';
import createPublicObjectUrl from '@/lib/upload/createPublicObjectUrl';
import type { SerializableParticipant } from '@/typings/SerializableParticipant';
import bytes from 'bytes';
import { extension } from 'mime-types';
import Image from 'next/image';
import { default as NextLink } from 'next/link';
import { type ChangeEvent, ReactElement, SyntheticEvent, useCallback, useState } from 'react';
import { BiTrash } from 'react-icons/bi';
import { GrEdit } from 'react-icons/gr';

interface Props {
    application: SerializableParticipant;
}

const ApplicationDetailsImage = ({ application: { id, name, imageFileName } }: Props): ReactElement => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const imageUrl = isEmptyString(imageFileName) ? null : createPublicObjectUrl(imageFileName);

    const handleDelete = useCallback(
        async (event: SyntheticEvent<HTMLButtonElement>) => {
            event.stopPropagation();

            if (!window.confirm('Bild unwiderruflich löschen?')) {
                return;
            }

            await deleteApplicationImage(id);
        },
        [id],
    );

    const handleReplace = useCallback(
        async ({ target }: ChangeEvent<HTMLInputElement>) => {
            setIsSubmitting(true);

            if (target.files === null || target.files[0] === undefined) {
                setIsSubmitting(false);
                return;
            }

            const file = target.files[0];

            if (!allowedImageContentTypes.includes(file.type)) {
                alert(`Dateityp nicht zulässig, erlaubt sind ${allowedImageContentTypes.map((type) => `.${extension(type)}`).join(', ')}`);
                setIsSubmitting(false);
                return;
            }

            if (file.size > allowedImageMaxFileSize) {
                alert(`Max. ${bytes.format(allowedImageMaxFileSize, { unitSeparator: '', unit: 'MB' })} zulässig`);
                setIsSubmitting(false);
                return;
            }

            const imageDataUrl = await blobToDataUrl(file);

            if (typeof imageDataUrl !== 'string') {
                alert(`Es ist ein technischer Fehler aufgetreten`);
                setIsSubmitting(false);
                return;
            }

            await replaceApplicationImage(id, imageDataUrl);

            setIsSubmitting(false);
        },
        [id],
    );

    return (
        <div
            className={cn(
                'relative h-[300px] shrink-0 overflow-auto border-b border-black md:w-1/3 md:border-l',
                isEmptyString(imageUrl) && 'h-[50px]',
            )}
        >
            {isNotEmptyString(imageUrl) ? (
                <>
                    <NextLink href={imageUrl} className="md:cursor-pointer" target="_blank">
                        <Image src={imageUrl} alt={name} fill={true} priority={true} className="object-cover" />
                    </NextLink>

                    <div className="absolute top-2 right-2 z-0 flex gap-2">
                        <label
                            className="cursor-pointer rounded bg-white/50 p-1 text-gray-700 hover:bg-white/70"
                            htmlFor={`file-upload-${id}`}
                        >
                            <GrEdit />
                        </label>
                        <input
                            id={`file-upload-${id}`}
                            type="file"
                            onChange={handleReplace}
                            className="hidden"
                            accept={allowedImageContentTypes.join(', ')}
                            disabled={isSubmitting}
                        />

                        <button
                            onClick={handleDelete}
                            className="rounded bg-white/50 p-1 text-gray-700 hover:bg-white/70"
                            title="Bild ändern"
                            disabled={isSubmitting}
                        >
                            <BiTrash />
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <label
                        className="absolute top-2 left-2 cursor-pointer bg-white/50 px-2 py-1 text-gray-700 hover:bg-white/70"
                        htmlFor={`file-upload-${id}`}
                    >
                        Bild hinzufügen
                    </label>
                    <input
                        id={`file-upload-${id}`}
                        type="file"
                        onChange={handleReplace}
                        className="hidden"
                        accept={allowedImageContentTypes.join(', ')}
                        disabled={isSubmitting}
                    />
                </>
            )}
        </div>
    );
};

export default ApplicationDetailsImage;
