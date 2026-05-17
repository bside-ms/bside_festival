import Badge from '@/components/participants/details/Badge';
import cn from '@/lib/common/helper/cn';
import isEmptyString from '@/lib/common/helper/isEmptyString';
import isNotEmptyString from '@/lib/common/helper/isNotEmptyString';
import statusLabels from '@/lib/participants/status/statusLabels';
import typeColors from '@/lib/participants/typeColors';
import typeLabels from '@/lib/participants/typeLabels';
import createPublicObjectUrl from '@/lib/upload/createPublicObjectUrl';
import type { SerializableParticipant } from '@/typings/SerializableParticipant';
import type { Genre } from '@prisma/client';
import Image from 'next/image';
import type { ReactElement } from 'react';

interface Props {
    application: SerializableParticipant;
    genres: Array<Genre>;
    onClick: () => void;
}

const ApplicationPreview = ({ application, genres, onClick }: Props): ReactElement => {
    const { name, imageFileName, type, status, description } = application;

    const imageUrl = isEmptyString(imageFileName) ? null : createPublicObjectUrl(imageFileName);

    return (
        <div
            className="relative flex flex-col justify-between gap-2 rounded-md border border-black bg-white/20 shadow-lg backdrop-blur-2xl md:cursor-pointer md:flex-row-reverse md:hover:brightness-110"
            onClick={onClick}
        >
            <div
                className={cn(
                    'relative h-[300px] shrink-0 overflow-auto rounded-t-md border-b border-black md:w-1/3 md:rounded-md md:rounded-l-none md:border-b-0 md:border-l',
                    isEmptyString(imageUrl) && 'h-auto',
                )}
            >
                {isNotEmptyString(imageUrl) && <Image src={imageUrl} alt={name} fill={true} priority={true} className="object-cover" />}
            </div>

            <div className="p-2">
                <div className="mb-2 flex flex-wrap gap-2">
                    <Badge label={typeLabels[type]} backgroundColor={typeColors[type]} />

                    {genres.map(({ id, name: genreName }) => (
                        <Badge key={id} label={genreName} backgroundColor="#fcb8b8" />
                    ))}

                    <Badge label={statusLabels[status]} backgroundColor="lightgray" />
                </div>

                <div className="line-clamp-3 font-display text-2xl">{name}</div>

                {isNotEmptyString(description) && <div className="mt-4 line-clamp-6">{description}</div>}
            </div>
        </div>
    );
};

export default ApplicationPreview;
