import { type ChangeEvent, ReactElement, SyntheticEvent, useCallback, useState } from 'react';
import isNotEmptyString from 'lib/common/helper/isNotEmptyString';
import { default as NextLink } from 'next/link';
import Image from 'next/image';
import type { SerializableParticipant } from 'typings/SerializableParticipant';
import isEmptyString from 'lib/common/helper/isEmptyString';
import createPublicObjectUrl from 'lib/upload/createPublicObjectUrl';
import { BiTrash } from 'react-icons/bi';
import { GrEdit } from 'react-icons/gr';
import PinParticipantToggle from 'components/participants/overview/PinParticipantToggle';
import { DeleteImageRequest, SuccessfulDeleteImageResponse } from 'pages/api/applications/update/image/delete';
import { allowedImageContentTypes, allowedImageMaxFileSize } from 'components/applications/applicationForm/ImageUpload';
import { extension } from 'mime-types';
import bytes from 'bytes';
import blobToDataUrl from 'lib/common/helper/blobToDataUrl';
import { ReplaceImageRequest } from 'pages/api/applications/update/image/replace';
import { useParticipantsOverviewContext } from 'components/participants/overview/ParticipantsOverviewContext';

interface Props {
    participant: SerializableParticipant;
}

const ParticipantImage = ({ participant: { id, name, status, imageFileName } }: Props): ReactElement => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { updateParticipant } = useParticipantsOverviewContext();

    const imageUrl = isEmptyString(imageFileName) ? null : createPublicObjectUrl(imageFileName);

    const handleDelete = useCallback(async (event: SyntheticEvent<HTMLButtonElement>) => {
        event.stopPropagation();

        if (!window.confirm('Bild unwiderruflich löschen?')) {
            return;
        }

        const request: DeleteImageRequest = { id };

        const response = await fetch('/api/applications/update/image/delete', {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(request),
        });

        if (response.ok) {
            const { updatedParticipant } = (await response.json()) as SuccessfulDeleteImageResponse;

            updateParticipant(updatedParticipant);
        }
    }, []);

    const handleReplace = useCallback(async ({ target }: ChangeEvent<HTMLInputElement>) => {
        setIsSubmitting(true);

        if (target.files === null || target.files[0] === undefined) {
            setIsSubmitting(false);
            return;
        }

        const file = target.files[0];

        if (!allowedImageContentTypes.includes(file.type)) {
            alert(
                `Dateityp nicht zulässig, erlaubt sind ${allowedImageContentTypes
                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                    .map((type) => `.${extension(type)}`)
                    .join(', ')}`,
            );
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

        const request: ReplaceImageRequest = { id, encodedImage: imageDataUrl };

        console.log('request', request);

        const response = await fetch('/api/applications/update/image/replace', {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(request),
        });

        if (response.ok) {
            const { updatedParticipant } = (await response.json()) as SuccessfulDeleteImageResponse;

            updateParticipant(updatedParticipant);
        }

        setIsSubmitting(false);
    }, []);

    return (
        <div className="relative h-[300px] shrink-0 overflow-auto rounded-md md:w-1/3">
            <PinParticipantToggle participantId={id} />

            {status === 'Canceled' && (
                <div className="absolute inset-0 z-30 flex items-center justify-center bg-red-800/70 p-5 text-center text-6xl text-gray-100">
                    Fällt leider aus
                </div>
            )}

            {isNotEmptyString(imageUrl) ? (
                <>
                    <NextLink href={imageUrl} className="md:cursor-pointer" target="_blank">
                        <Image src={imageUrl} alt={name} fill={true} priority={true} className="object-cover" />
                    </NextLink>

                    <div className="absolute bottom-2 right-2 flex gap-2">
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
                        >
                            <BiTrash />
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <label
                        className="absolute left-2 top-2 cursor-pointer rounded bg-white/50 px-2 py-1 text-gray-700 hover:bg-white/70"
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

export default ParticipantImage;
