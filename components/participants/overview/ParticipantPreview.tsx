import Badge from '@/components/participants/details/Badge';
import ParticipantVenues from '@/components/participants/details/ParticipantVenues';
import {
    useParticipantSlots,
    useParticipantsOverviewContext,
    useParticipantVenues,
} from '@/components/participants/overview/ParticipantsOverviewContext';
import cn from '@/lib/common/helper/cn';
import formatDate from '@/lib/common/helper/formatDate';
import isEmptyString from '@/lib/common/helper/isEmptyString';
import isNotEmptyNumber from '@/lib/common/helper/isNotEmptyNumber';
import isNotEmptyString from '@/lib/common/helper/isNotEmptyString';
import hasSlotOrVenue from '@/lib/participants/hasSlotOrVenue';
import typeColors from '@/lib/participants/typeColors';
import typeLabels from '@/lib/participants/typeLabels';
import createPublicObjectUrl from '@/lib/upload/createPublicObjectUrl';
import type { SerializableParticipant } from '@/typings/SerializableParticipant';
import Image from 'next/image';
import { Fragment, ReactElement } from 'react';

interface Props {
    participant: SerializableParticipant;
    onClick: () => void;
}

const ParticipantPreview = ({ participant, onClick }: Props): ReactElement | null => {
    const { areLocationOrDateRangeFiltersSet } = useParticipantsOverviewContext();

    const participantSlots = useParticipantSlots(participant.id);
    const participantVenues = useParticipantVenues(participant.id);

    const { id, name, updatedName, imageFileName, description, type, updatedDescription } = participant;

    const imageUrl = isEmptyString(imageFileName) ? null : createPublicObjectUrl(imageFileName);

    if (
        areLocationOrDateRangeFiltersSet &&
        ((hasSlotOrVenue(participant.type) === 'slot' && participantSlots.length === 0) ||
            (hasSlotOrVenue(participant.type) === 'venue' && participantVenues.length === 0))
    ) {
        return null;
    }

    return (
        <div className="px-2">
            <div
                className="relative flex flex-col justify-between rounded-2xl border border-black bg-[#eaebeb] hover:brightness-105 md:cursor-pointer md:flex-row-reverse md:p-5"
                onClick={onClick}
            >
                <div
                    className={cn(
                        'relative min-h-[300px] shrink-0 overflow-auto rounded-t-2xl border-b border-black md:w-1/3',
                        isEmptyString(imageUrl) && 'h-[50px] min-h-0',
                    )}
                >
                    {/*<PinParticipantToggle participantId={id} />*/}

                    {participant.status === 'Canceled' && (
                        <div className="absolute inset-0 z-30 flex items-center justify-center bg-red-800/70 p-5 text-center text-6xl text-gray-100">
                            Fällt leider aus
                        </div>
                    )}

                    {isNotEmptyString(imageUrl) && (
                        <Image src={imageUrl} alt={updatedName ?? name} fill={true} priority={true} className="object-cover" />
                    )}
                </div>

                <div className="px-3 pt-3 pb-2">
                    <div className="line-clamp-3 font-display text-2xl">{updatedName ?? name}</div>

                    <div className="my-2 flex flex-wrap gap-2">
                        <Badge label={typeLabels[type]} backgroundColor={typeColors[type]} />

                        {participantSlots.map(({ slot: { id, begin, maxAttendees }, location: { name } }) => (
                            <Fragment key={id}>
                                <Badge label={formatDate(new Date(begin), 'EEEEEE HH:mm')} backgroundColor="#b1c32c" />
                                <Badge label={name} backgroundColor="#ebc9de" />
                                {isNotEmptyNumber(maxAttendees) && <Badge label="Anmeldung erforderlich" backgroundColor="#b0e4cc" />}
                            </Fragment>
                        ))}

                        {participantVenues.map(({ dates, venue: { id }, location: { name } }) => (
                            <Fragment key={id}>
                                {dates.map((date) => {
                                    const formattedDate = formatDate(new Date(date), 'EEEEEE HH:mm');
                                    return <Badge key={formattedDate} label={formattedDate} backgroundColor="#b1c32c" />;
                                })}

                                <Badge label={name} backgroundColor="#ebc9de" />
                            </Fragment>
                        ))}
                    </div>

                    <ParticipantVenues participantId={id} isInPreview={true} />

                    {isNotEmptyString(updatedDescription ?? description) && (
                        <div className="mt-4 line-clamp-5 font-display text-sm leading-5 md:line-clamp-[8] md:text-base md:leading-6">
                            {updatedDescription ?? description}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ParticipantPreview;
