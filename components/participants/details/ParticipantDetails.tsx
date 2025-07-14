import AttendeeForm from '@/components/participants/attendeeForm/AttendeeForm';
import Badge from '@/components/participants/details/Badge';
import ParticipantAdditionalInfo from '@/components/participants/details/ParticipantAdditionalInfo';
import ParticipantCanProvideBackline from '@/components/participants/details/ParticipantCanProvideBackline';
import ParticipantContacts from '@/components/participants/details/ParticipantContacts';
import ParticipantImage from '@/components/participants/details/ParticipantImage';
import ParticipantLinks from '@/components/participants/details/ParticipantLinks';
import ParticipantMaterialExpenses from '@/components/participants/details/ParticipantMaterialExpenses';
import ParticipantNameAndDescriptionForm from '@/components/participants/details/ParticipantNameAndDescriptionForm';
import ParticipantTechnicalRider from '@/components/participants/details/ParticipantTechnicalRider';
import SlotAttendeeData from '@/components/participants/details/SlotAttendeeData';
import {
    useParticipantSlots,
    useParticipantsOverviewContext,
    useParticipantVenues,
} from '@/components/participants/overview/ParticipantsOverviewContext';
import SlotForm from '@/components/participants/slotsForm/SlotForm';
import VenueForm from '@/components/participants/venueForm/VenueForm';
import formatDate from '@/lib/common/helper/formatDate';
import isNotEmptyNumber from '@/lib/common/helper/isNotEmptyNumber';
import hasSlotOrVenue from '@/lib/participants/hasSlotOrVenue';
import typeColors from '@/lib/participants/typeColors';
import typeLabels from '@/lib/participants/typeLabels';
import type { SerializableParticipant } from '@/typings/SerializableParticipant';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Genre, Link } from '@prisma/client';
import { Fragment, ReactElement, useCallback, useState } from 'react';

interface Props {
    participant: SerializableParticipant;
    genres: Array<Genre>;
    links: Array<Link>;
    onCloseClick: () => void;
    isLoggedIn: boolean;
}

const ParticipantDetails = ({ participant, genres, links, onCloseClick, isLoggedIn }: Props): ReactElement | null => {
    const { areLocationOrDateRangeFiltersSet } = useParticipantsOverviewContext();

    const { id, name, updatedName, type } = participant;

    const participantSlots = useParticipantSlots(participant.id);
    const participantVenues = useParticipantVenues(participant.id);

    const [showDetailsForm, setShowDetailsForm] = useState(false);
    const toggleDetailsForm = useCallback(() => setShowDetailsForm((prevState) => !prevState), []);

    if (
        areLocationOrDateRangeFiltersSet &&
        ((hasSlotOrVenue(participant.type) === 'slot' && participantSlots.length === 0) ||
            (hasSlotOrVenue(participant.type) === 'venue' && participantVenues.length === 0))
    ) {
        return null;
    }

    return (
        <div className="px-2 font-display">
            <div className="relative rounded-2xl border border-black bg-white/20 md:cursor-pointer md:p-5">
                <div className="flex flex-col justify-between md:flex-row-reverse">
                    <ParticipantImage participant={participant} isLoggedIn={isLoggedIn} />

                    <div className="px-3 pt-3 pb-2">
                        {!showDetailsForm && (
                            <>
                                <div className="font-display text-2xl">{updatedName ?? name}</div>

                                <div className="my-2 flex flex-wrap gap-2">
                                    <Badge label={typeLabels[type]} backgroundColor={typeColors[type]} />

                                    {genres.map(({ id, name: genreName }) => (
                                        <Badge key={id} label={genreName} backgroundColor="#fcb8b8" />
                                    ))}

                                    {participantSlots.map(({ slot: { id, begin, maxAttendees }, location: { name } }) => (
                                        <Fragment key={id}>
                                            <Badge label={formatDate(new Date(begin), 'EEEEEE HH:mm')} backgroundColor="#b1c32c" />
                                            <Badge label={name} backgroundColor="#ebc9de" />
                                            {isNotEmptyNumber(maxAttendees) && (
                                                <Badge label="Anmeldung erforderlich" backgroundColor="#b0e4cc" />
                                            )}
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

                                {participant.status === 'Canceled' && (
                                    <div className="text-lg font-bold text-red-900">
                                        Leider kann dieser Programmpunkt nicht stattfinden!
                                    </div>
                                )}
                            </>
                        )}

                        <ParticipantNameAndDescriptionForm
                            participant={participant}
                            isLoggedIn={isLoggedIn}
                            showForm={showDetailsForm}
                            toggleForm={toggleDetailsForm}
                        />

                        <ParticipantLinks links={links} />
                    </div>
                </div>

                {participantSlots.length === 1 &&
                    participantSlots[0] !== undefined &&
                    isNotEmptyNumber(participantSlots[0].slot.maxAttendees) && (
                        <div className="relative mt-1 rounded-md p-2">
                            <AttendeeForm slot={participantSlots[0]} />
                        </div>
                    )}

                {isLoggedIn &&
                    hasSlotOrVenue(type) === 'slot' &&
                    participantSlots.length === 1 &&
                    participantSlots[0] !== undefined &&
                    isNotEmptyNumber(participantSlots[0].slot.maxAttendees) && (
                        <div className="relative mt-1 rounded-md p-2">
                            <SlotAttendeeData slot={participantSlots[0].slot} />
                        </div>
                    )}

                {isLoggedIn && hasSlotOrVenue(type) === 'slot' && (
                    <div className="relative mt-1 rounded-md p-2">
                        <SlotForm participantId={id} />
                    </div>
                )}

                {isLoggedIn && hasSlotOrVenue(type) === 'venue' && (
                    <div className="relative mt-1 rounded-md p-2">
                        <VenueForm participantId={id} />
                    </div>
                )}

                {isLoggedIn && (
                    <div className="relative rounded-md p-2">
                        <ParticipantContacts participant={participant} />

                        <ParticipantMaterialExpenses participant={participant} />

                        <ParticipantCanProvideBackline participant={participant} />

                        <ParticipantTechnicalRider participant={participant} />

                        <ParticipantAdditionalInfo participant={participant} />
                    </div>
                )}

                <div
                    className="relative mt-1 flex justify-center rounded-md p-1 hover:brightness-110 md:hover:cursor-pointer"
                    onClick={onCloseClick}
                >
                    <FontAwesomeIcon className="w-5" icon={faTimes} />
                </div>
            </div>
        </div>
    );
};

export default ParticipantDetails;
