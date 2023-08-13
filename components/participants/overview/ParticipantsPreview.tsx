import Image from 'next/image';
import type { ReactElement } from 'react';
import TypeBadge from 'components/participants/details/TypeBadge';
import isEmptyString from 'lib/common/helper/isEmptyString';
import isNotEmptyString from 'lib/common/helper/isNotEmptyString';
import createPublicObjectUrl from 'lib/upload/createPublicObjectUrl';
import type { SerializableParticipant } from 'typings/SerializableParticipant';

interface Props {
    application: SerializableParticipant;
    onClick: () => void;
}

const ParticipantsPreview = ({ application, onClick }: Props): ReactElement => {

    const { name, imageFileName, description, type, updatedDescription } = application;

    const imageUrl = isEmptyString(imageFileName) ? null : createPublicObjectUrl(imageFileName);

    return (
        <div
            className="p-3 md:p-5 rounded-md shadow-lg relative text-gray-800 backdrop-blur-2xl flex flex-col md:flex-row-reverse justify-between gap-4 md:hover:brightness-110 md:cursor-pointer"
            onClick={onClick}
        >
            <div className="md:w-1/3 shrink-0 relative rounded-md overflow-auto min-h-[300px]">
                {isNotEmptyString(imageUrl) && (
                    <Image
                        src={imageUrl}
                        alt={name}
                        fill={true}
                        priority={true}
                        className="object-cover"
                    />
                )}
            </div>

            <div>
                <div className="mb-1">
                    <TypeBadge type={type} />
                </div>

                <div className="text-2xl font-display line-clamp-3">
                    {name}
                </div>

                {isNotEmptyString(description) && (
                    <div className="mt-4 line-clamp-6">
                        {updatedDescription ?? description}
                    </div>
                )}

            </div>

        </div>
    );
};

export default ParticipantsPreview;
