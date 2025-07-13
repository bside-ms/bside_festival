import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Link } from '@prisma/client';
import AttendeeForm from 'components/participants/attendeeForm/AttendeeForm';
import Badge from 'components/participants/details/Badge';
import ParticipantAdditionalInfo from 'components/participants/details/ParticipantAdditionalInfo';
import ParticipantCanProvideBackline from 'components/participants/details/ParticipantCanProvideBackline';
import ParticipantContacts from 'components/participants/details/ParticipantContacts';
import ParticipantImage from 'components/participants/details/ParticipantImage';
import ParticipantLinks from 'components/participants/details/ParticipantLinks';
import ParticipantMaterialExpenses from 'components/participants/details/ParticipantMaterialExpenses';
import ParticipantNameAndDescriptionForm from 'components/participants/details/ParticipantNameAndDescriptionForm';
import ParticipantSlots from 'components/participants/details/ParticipantSlots';
import ParticipantTechnicalRider from 'components/participants/details/ParticipantTechnicalRider';
import ParticipantVenues from 'components/participants/details/ParticipantVenues';
import SlotAttendeeData from 'components/participants/details/SlotAttendeeData';
import {
    useParticipantSlots,
    useParticipantsOverviewContext,
    useParticipantVenues,
} from 'components/participants/overview/ParticipantsOverviewContext';
import SlotForm from 'components/participants/slotsForm/SlotForm';
import VenueForm from 'components/participants/venueForm/VenueForm';
import isNotEmptyNumber from 'lib/common/helper/isNotEmptyNumber';
import hasSlotOrVenue from 'lib/participants/hasSlotOrVenue';
import typeColors from 'lib/participants/typeColors';
import typeLabels from 'lib/participants/typeLabels';
import { ReactElement, useCallback, useState } from 'react';
import type { SerializableParticipant } from 'typings/SerializableParticipant';

interface Props {
    participant: SerializableParticipant;
    links: Array<Link>;
    onCloseClick: () => void;
    isLoggedIn: boolean;
}

const ParticipantDetails = ({ participant, links, onCloseClick, isLoggedIn }: Props): ReactElement | null => {
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
            <div className="relative flex flex-col justify-between rounded-2xl border border-black bg-white/20 md:cursor-pointer md:flex-row-reverse md:p-5">
                <div>
                    <ParticipantImage participant={participant} isLoggedIn={isLoggedIn} />

                    <div className="px-3 pt-3 pb-2">
                        <div>
                            <Badge label={typeLabels[type]} backgroundColor={typeColors[type]} />
                        </div>

                        {!showDetailsForm && (
                            <>
                                <div className="font-display text-2xl">{updatedName ?? name}</div>

                                {participant.status === 'Canceled' && (
                                    <div className="text-lg font-bold text-red-900">
                                        Leider kann dieser Programmpunkt nicht stattfinden!
                                    </div>
                                )}

                                {participantSlots.length > 0 && <ParticipantSlots participantSlots={participantSlots} />}

                                <ParticipantVenues participantId={id} />
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
