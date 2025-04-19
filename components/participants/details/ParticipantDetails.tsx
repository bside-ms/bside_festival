import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Link } from '@prisma/client';
import AttendeeForm from 'components/participants/attendeeForm/AttendeeForm';
import ParticipantAdditionalInfo from 'components/participants/details/ParticipantAdditionalInfo';
import ParticipantCanProvideBackline from 'components/participants/details/ParticipantCanProvideBackline';
import ParticipantContacts from 'components/participants/details/ParticipantContacts';
import ParticipantDescriptionForm from 'components/participants/details/ParticipantDescriptionForm';
import ParticipantImage from 'components/participants/details/ParticipantImage';
import ParticipantLinks from 'components/participants/details/ParticipantLinks';
import ParticipantMaterialExpenses from 'components/participants/details/ParticipantMaterialExpenses';
import ParticipantSlots from 'components/participants/details/ParticipantSlots';
import ParticipantTechnicalRider from 'components/participants/details/ParticipantTechnicalRider';
import ParticipantVenues from 'components/participants/details/ParticipantVenues';
import SlotAttendeeData from 'components/participants/details/SlotAttendeeData';
import TypeBadge from 'components/participants/details/TypeBadge';
import {
    useParticipantSlots,
    useParticipantsOverviewContext,
    useParticipantVenues,
} from 'components/participants/overview/ParticipantsOverviewContext';
import SlotForm from 'components/participants/slotsForm/SlotForm';
import VenueForm from 'components/participants/venueForm/VenueForm';
import isNotEmptyNumber from 'lib/common/helper/isNotEmptyNumber';
import hasSlotOrVenue from 'lib/participants/hasSlotOrVenue';
import type { ReactElement } from 'react';
import type { SerializableParticipant } from 'typings/SerializableParticipant';

interface Props {
    participant: SerializableParticipant;
    links: Array<Link>;
    onCloseClick: () => void;
    isLoggedIn: boolean;
}

const ParticipantDetails = ({ participant, links, onCloseClick, isLoggedIn }: Props): ReactElement | null => {
    const { areLocationOrDateRangeFiltersSet } = useParticipantsOverviewContext();

    const { id, name, type } = participant;

    const participantSlots = useParticipantSlots(participant.id);
    const participantVenues = useParticipantVenues(participant.id);

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

            <div className="relative flex flex-col justify-between gap-4 bg-white p-3 text-gray-800 md:p-5">
                <div className="flex flex-col justify-between gap-4 md:flex-row-reverse">
                    <ParticipantImage participant={participant} isLoggedIn={isLoggedIn} />

                    <div className="shrink grow-0">
                        <div className="mb-1">
                            <TypeBadge type={type} />
                        </div>

                        <div className="font-display text-2xl">{name}</div>

                        {participant.status === 'Canceled' && (
                            <div className="mt-3 text-lg font-bold text-red-900">Leider kann dieser Programmpunkt nicht stattfinden!</div>
                        )}

                        {participantSlots.length > 0 && <ParticipantSlots participantSlots={participantSlots} />}

                        <ParticipantVenues participantId={id} />

                        <ParticipantDescriptionForm participant={participant} isLoggedIn={isLoggedIn} />

                        <ParticipantLinks links={links} />
                    </div>
                </div>

                {participantSlots.length === 1 &&
                    participantSlots[0] !== undefined &&
                    isNotEmptyNumber(participantSlots[0].slot.maxAttendees) && (
                        <div className="relative mt-1 rounded-md py-2 text-gray-800">
                            <AttendeeForm slot={participantSlots[0]} />
                        </div>
                    )}

                {isLoggedIn &&
                    hasSlotOrVenue(type) === 'slot' &&
                    participantSlots.length === 1 &&
                    participantSlots[0] !== undefined &&
                    isNotEmptyNumber(participantSlots[0].slot.maxAttendees) && (
                        <div className="relative mt-1 rounded-md py-2 text-gray-800">
                            <SlotAttendeeData slot={participantSlots[0].slot} />
                        </div>
                    )}

                {isLoggedIn && hasSlotOrVenue(type) === 'slot' && (
                    <div className="relative mt-1 rounded-md py-2 text-gray-800">
                        <SlotForm participantId={id} />
                    </div>
                )}

                {isLoggedIn && hasSlotOrVenue(type) === 'venue' && (
                    <div className="relative mt-1 rounded-md py-2 text-gray-800">
                        <VenueForm participantId={id} />
                    </div>
                )}

                {isLoggedIn && (
                    <div className="relative rounded-md py-2 text-gray-800">
                        <ParticipantContacts participant={participant} />

                        <ParticipantMaterialExpenses participant={participant} />

                        <ParticipantCanProvideBackline participant={participant} />

                        <ParticipantTechnicalRider participant={participant} />

                        <ParticipantAdditionalInfo participant={participant} />
                    </div>
                )}

                <div
                    className="relative mt-1 flex justify-center rounded-md p-1 text-gray-800 hover:brightness-110 md:hover:cursor-pointer"
                    onClick={onCloseClick}
                >
                    <FontAwesomeIcon className="w-5" icon={faTimes} />
                </div>
            </div>

            <div className="h-3 w-full bg-black" />
        </div>
    );
};

export default ParticipantDetails;
