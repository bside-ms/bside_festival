import type { Label } from '@prisma/client';
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

interface Props {
    application: SerializableParticipant;
    labels: Array<Label>;
    onClick: () => void;
}

const ApplicationPreview = ({ application, labels, onClick }: Props): ReactElement => {
    const { name, imageFileName, type, curationScore, status, description, updatedDescription } = application;

    const imageUrl = isEmptyString(imageFileName) ? null : createPublicObjectUrl(imageFileName);

    return (
        <div
            className="relative flex flex-col justify-between gap-4 rounded-md p-3 text-gray-800 shadow-lg backdrop-blur-2xl md:cursor-pointer md:flex-row-reverse md:p-5 md:hover:brightness-110"
            onClick={onClick}
        >
            <div className="relative min-h-[300px] shrink-0 overflow-auto rounded-md md:w-1/3">
                {isNotEmptyString(imageUrl) && <Image src={imageUrl} alt={name} fill={true} priority={true} className="object-cover" />}
            </div>

            <div>
                <div className="mb-2 flex gap-2">
                    <TypeBadge type={type} />

                    {isNotEmptyNumber(curationScore) && (
                        <div className="rounded-2xl bg-gray-800 px-3 py-1 text-sm text-white">{curationScore}</div>
                    )}

                    <div className="inline-block select-none rounded-2xl bg-gray-800 px-3 py-1 text-sm uppercase text-white">
                        {statusLabels[status]}
                    </div>
                </div>

                <ApplicationLabels labels={labels} />

                <div className="line-clamp-3 font-display text-2xl">{name}</div>

                {isNotEmptyString(description) && <div className="mt-4 line-clamp-6">{updatedDescription ?? description}</div>}
            </div>
        </div>
    );
};

export default ApplicationPreview;
