import Image from 'next/image';
import type { ReactElement } from 'react';
import ParticipantSlots from 'components/participants/details/ParticipantSlots';
import ParticipantVenues from 'components/participants/details/ParticipantVenues';
import TypeBadge from 'components/participants/details/TypeBadge';
import {
    useParticipantSlots,
    useParticipantsOverviewContext,
    useParticipantVenues,
} from 'components/participants/overview/ParticipantsOverviewContext';
import PinParticipantToggle from 'components/participants/overview/PinParticipantToggle';
import isEmptyString from 'lib/common/helper/isEmptyString';
import isNotEmptyString from 'lib/common/helper/isNotEmptyString';
import hasSlotOrVenue from 'lib/participants/hasSlotOrVenue';
import createPublicObjectUrl from 'lib/upload/createPublicObjectUrl';
import type { SerializableParticipant } from 'typings/SerializableParticipant';
import cn from 'lib/common/helper/cn';

interface Props {
    participant: SerializableParticipant;
    onClick: () => void;
}

const ParticipantsPreview = ({ participant, onClick }: Props): ReactElement | null => {
    const { areLocationOrDateRangeFiltersSet } = useParticipantsOverviewContext();

    const participantSlots = useParticipantSlots(participant.id);
    const participantVenues = useParticipantVenues(participant.id);

    const { id, name, imageFileName, description, type, updatedDescription } = participant;

    const imageUrl = isEmptyString(imageFileName) ? null : createPublicObjectUrl(imageFileName);

    if (
        areLocationOrDateRangeFiltersSet &&
        ((hasSlotOrVenue(participant.type) === 'slot' && participantSlots.length === 0) ||
            (hasSlotOrVenue(participant.type) === 'venue' && participantVenues.length === 0))
    ) {
        return null;
    }

    return (
        <div>
            <div className="h-3 w-full bg-black" />

            <div
                className="relative flex flex-col justify-between gap-4 bg-white p-3 text-gray-800 md:cursor-pointer md:flex-row-reverse md:p-5"
                onClick={onClick}
            >
                <div
                    className={cn(
                        'relative min-h-[300px] shrink-0 overflow-auto rounded-md md:w-1/3',
                        isEmptyString(imageUrl) && 'min-h-0 h-[50px]',
                    )}
                >
                    <PinParticipantToggle participantId={id} />

                    {participant.status === 'Canceled' && (
                        <div className="absolute inset-0 z-30 flex items-center justify-center bg-red-800/70 p-5 text-center text-6xl text-gray-100">
                            Fällt leider aus
                        </div>
                    )}

                    {isNotEmptyString(imageUrl) && <Image src={imageUrl} alt={name} fill={true} priority={true} className="object-cover" />}
                </div>

                <div>
                    <div className="mb-1">
                        <TypeBadge type={type} />
                    </div>

                    <div className="line-clamp-3 font-display text-2xl">{name}</div>

                    {participantSlots.length > 0 && <ParticipantSlots participantSlots={participantSlots} isInPreview={true} />}

                    <ParticipantVenues participantId={id} isInPreview={true} />

                    {isNotEmptyString(updatedDescription ?? description) && (
                        <div className="mt-4 line-clamp-3">{updatedDescription ?? description}</div>
                    )}
                </div>
            </div>

            <div className="h-3 w-full bg-black" />
        </div>
    );
};

export default ParticipantsPreview;
