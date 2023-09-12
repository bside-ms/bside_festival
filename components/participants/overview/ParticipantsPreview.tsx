import Image from 'next/image';
import type { ReactElement } from 'react';
import ParticipantSlots from 'components/participants/details/ParticipantSlots';
import ParticipantVenues from 'components/participants/details/ParticipantVenues';
import TypeBadge from 'components/participants/details/TypeBadge';
import { useParticipantSlots, useParticipantsOverviewContext } from 'components/participants/overview/ParticipantsOverviewContext';
import isEmptyString from 'lib/common/helper/isEmptyString';
import isNotEmptyString from 'lib/common/helper/isNotEmptyString';
import createPublicObjectUrl from 'lib/upload/createPublicObjectUrl';
import type { SerializableParticipant } from 'typings/SerializableParticipant';

interface Props {
    participant: SerializableParticipant;
    onClick: () => void;
}

const ParticipantsPreview = ({ participant, onClick }: Props): ReactElement | null => {

    const { filteredParticipants } = useParticipantsOverviewContext();

    const participantSlots = useParticipantSlots(participant.id);

    const { id, name, imageFileName, description, type, updatedDescription } = participant;

    const imageUrl = isEmptyString(imageFileName) ? null : createPublicObjectUrl(imageFileName);

    if (filteredParticipants.length > 0 && participantSlots.length === 0) {
        return null;
    }

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

                {participantSlots.length > 0 && (
                    <ParticipantSlots
                        participantSlots={participantSlots}
                        isInPreview={true}
                    />
                )}

                <ParticipantVenues
                    participantId={id}
                    isInPreview={true}
                />

                {isNotEmptyString(description) && (
                    <div className="mt-4 line-clamp-3">
                        {updatedDescription ?? description}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ParticipantsPreview;
