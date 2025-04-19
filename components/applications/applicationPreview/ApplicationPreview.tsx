import type { Genre, Label } from '@prisma/client';
import Image from 'next/image';
import type { ReactElement } from 'react';
import ApplicationLabels from 'components/applications/common/ApplicationLabels';
import TypeBadge from 'components/participants/details/TypeBadge';
import isEmptyString from 'lib/common/helper/isEmptyString';
import isNotEmptyNumber from 'lib/common/helper/isNotEmptyNumber';
import isNotEmptyString from 'lib/common/helper/isNotEmptyString';
import statusLabels from 'lib/participants/status/statusLabels';
import createPublicObjectUrl from 'lib/upload/createPublicObjectUrl';
import type { SerializableParticipant } from 'typings/SerializableParticipant';
import cn from 'lib/common/helper/cn';

interface Props {
    application: SerializableParticipant;
    labels: Array<Label>;
    genres: Array<Genre>;
    onClick: () => void;
}

const ApplicationPreview = ({ application, labels, genres, onClick }: Props): ReactElement => {
    const { name, imageFileName, type, curationScore, status, description, updatedDescription } = application;

    const imageUrl = isEmptyString(imageFileName) ? null : createPublicObjectUrl(imageFileName);

    return (
        <div
            className="relative flex flex-col justify-between gap-4 rounded-md p-3 shadow-lg bg-white/20 backdrop-blur-2xl md:cursor-pointer md:flex-row-reverse md:p-5 md:hover:brightness-110"
            onClick={onClick}
        >
            <div className={cn('relative h-[300px] shrink-0 overflow-auto rounded-md md:w-1/3', isEmptyString(imageUrl) && 'h-auto')}>
                {isNotEmptyString(imageUrl) && <Image src={imageUrl} alt={name} fill={true} priority={true} className="object-cover" />}
            </div>

            <div>
                <div className="mb-2 flex gap-2 flex-wrap">
                    <TypeBadge type={type} />

                    {genres.map(({ id, name: genreName }) => (
                        <div
                            key={id}
                            className="rounded-2xl bg-gray-200/60 px-3 py-1 text-sm text-gray-700 uppercase whitespace-nowrap max-w-50 overflow-hidden text-ellipsis"
                            title={genreName}
                        >
                            {genreName}
                        </div>
                    ))}

                    {isNotEmptyNumber(curationScore) && (
                        <div className="rounded-2xl bg-gray-800 px-3 py-1 text-sm text-gray-100">{curationScore}</div>
                    )}

                    <div className="inline-block select-none rounded-2xl bg-gray-800 px-3 py-1 text-sm uppercase text-white">
                        {statusLabels[status]}
                    </div>
                </div>

                <ApplicationLabels labels={labels} />

                <div className="line-clamp-3 font-display text-2xl text-gray-100">{name}</div>

                {isNotEmptyString(description) && (
                    <div className="mt-4 line-clamp-6 text-gray-100">{updatedDescription ?? description}</div>
                )}
            </div>
        </div>
    );
};

export default ApplicationPreview;
