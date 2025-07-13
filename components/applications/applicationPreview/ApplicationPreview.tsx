import type { Genre } from '@prisma/client';
import Badge from 'components/participants/details/Badge';
import cn from 'lib/common/helper/cn';
import isEmptyString from 'lib/common/helper/isEmptyString';
import isNotEmptyNumber from 'lib/common/helper/isNotEmptyNumber';
import isNotEmptyString from 'lib/common/helper/isNotEmptyString';
import statusLabels from 'lib/participants/status/statusLabels';
import typeColors from 'lib/participants/typeColors';
import typeLabels from 'lib/participants/typeLabels';
import createPublicObjectUrl from 'lib/upload/createPublicObjectUrl';
import Image from 'next/image';
import type { ReactElement } from 'react';
import type { SerializableParticipant } from 'typings/SerializableParticipant';

interface Props {
    application: SerializableParticipant;
    genres: Array<Genre>;
    onClick: () => void;
}

const ApplicationPreview = ({ application, genres, onClick }: Props): ReactElement => {
    const { name, updatedName, imageFileName, type, curationScore, status, description, updatedDescription } = application;

    const imageUrl = isEmptyString(imageFileName) ? null : createPublicObjectUrl(imageFileName);

    return (
        <div
            className="relative flex flex-col justify-between gap-4 rounded-md bg-white/20 p-3 shadow-lg backdrop-blur-2xl md:cursor-pointer md:flex-row-reverse md:p-5 md:hover:brightness-110"
            onClick={onClick}
        >
            <div className={cn('relative h-[300px] shrink-0 overflow-auto rounded-md md:w-1/3', isEmptyString(imageUrl) && 'h-auto')}>
                {isNotEmptyString(imageUrl) && (
                    <Image src={imageUrl} alt={updatedName ?? name} fill={true} priority={true} className="object-cover" />
                )}
            </div>

            <div>
                <div className="mb-2 flex flex-wrap gap-2">
                    <Badge label={typeLabels[type]} backgroundColor={typeColors[type]} />

                    {genres.map(({ id, name: genreName }) => (
                        <div
                            key={id}
                            className="max-w-50 overflow-hidden rounded-2xl bg-gray-200/60 px-3 py-1 text-sm text-ellipsis whitespace-nowrap text-gray-700 uppercase"
                            title={genreName}
                        >
                            {genreName}
                        </div>
                    ))}

                    {isNotEmptyNumber(curationScore) && (
                        <div className="rounded-2xl bg-gray-800 px-3 py-1 text-sm text-gray-100">{curationScore}</div>
                    )}

                    <div className="inline-block rounded-2xl bg-gray-800 px-3 py-1 text-sm text-white uppercase select-none">
                        {statusLabels[status]}
                    </div>
                </div>

                <div className="line-clamp-3 font-display text-2xl text-gray-100">{updatedName ?? name}</div>

                {isNotEmptyString(description) && (
                    <div className="mt-4 line-clamp-6 text-gray-100">{updatedDescription ?? description}</div>
                )}
            </div>
        </div>
    );
};

export default ApplicationPreview;
