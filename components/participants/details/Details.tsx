import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Link } from '@prisma/client';
import { useSession } from 'next-auth/react';
import type { ReactElement } from 'react';
import AdditionalInfo from 'components/participants/details/AdditionalInfo';
import Contacts from 'components/participants/details/Contacts';
import DescriptionForm from 'components/participants/details/DescriptionForm';
import Links from 'components/participants/details/Links';
import ParticipantSlots from 'components/participants/details/ParticipantSlots';
import ParticipantVenues from 'components/participants/details/ParticipantVenues';
import TechnicalRider from 'components/participants/details/TechnicalRider';
import TypeBadge from 'components/participants/details/TypeBadge';
import {
    useParticipantSlots,
    useParticipantsOverviewContext,
    useParticipantVenues,
} from 'components/participants/overview/ParticipantsOverviewContext';
import SlotForm from 'components/participants/slotsForm/SlotForm';
import hasSlotOrVenue from 'lib/participants/hasSlotOrVenue';
import type { SerializableParticipant } from 'typings/SerializableParticipant';
import ParticipantImage from 'components/participants/details/ParticipantImage';
import VenueForm from 'components/participants/venueForm/VenueForm';
import AttendeeForm from 'components/participants/attendeeForm/AttendeeForm';
import isNotEmptyNumber from 'lib/common/helper/isNotEmptyNumber';
import SlotAttendeeData from 'components/participants/details/SlotAttendeeData';
import MaterialExpenses from 'components/participants/details/MaterialExpenses';
import CanProvideBackline from 'components/participants/details/CanProvideBackline';

interface Props {
    participant: SerializableParticipant;
    links: Array<Link>;
    onCloseClick: () => void;
}

const Details = ({ participant, links, onCloseClick }: Props): ReactElement | null => {
    const { areLocationOrDateRangeFiltersSet } = useParticipantsOverviewContext();

    const { status } = useSession();

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
            <div className="relative flex flex-col justify-between gap-4 rounded-md p-3 text-gray-800 shadow-lg backdrop-blur-2xl md:flex-row-reverse md:p-5">
                <ParticipantImage participant={participant} />

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

                    <DescriptionForm participant={participant} />
                </div>
            </div>

            {participantSlots.length === 1 &&
                participantSlots[0] !== undefined &&
                isNotEmptyNumber(participantSlots[0].slot.maxAttendees) && (
                    <div className="relative mt-1 rounded-md px-3 py-2 text-gray-800 shadow-lg backdrop-blur-2xl md:px-5">
                        <AttendeeForm slot={participantSlots[0]} />
                    </div>
                )}

            {status === 'authenticated' &&
                hasSlotOrVenue(type) === 'slot' &&
                participantSlots.length === 1 &&
                participantSlots[0] !== undefined &&
                isNotEmptyNumber(participantSlots[0].slot.maxAttendees) && (
                    <div className="relative mt-1 rounded-md px-3 py-2 text-gray-800 shadow-lg backdrop-blur-2xl md:px-5">
                        <SlotAttendeeData slot={participantSlots[0].slot} />
                    </div>
                )}

            {status === 'authenticated' && hasSlotOrVenue(type) === 'slot' && (
                <div className="relative mt-1 rounded-md px-3 py-2 text-gray-800 shadow-lg backdrop-blur-2xl md:px-5">
                    <SlotForm participantId={id} />
                </div>
            )}

            {status === 'authenticated' && hasSlotOrVenue(type) === 'venue' && (
                <div className="relative mt-1 rounded-md px-3 py-2 text-gray-800 shadow-lg backdrop-blur-2xl md:px-5">
                    <VenueForm participantId={id} />
                </div>
            )}

            {status === 'authenticated' && (
                <div className="relative mt-1 rounded-md px-3 py-2 text-gray-800 shadow-lg backdrop-blur-2xl md:px-5">
                    <Links links={links} />

                    <Contacts participant={participant} />

                    <MaterialExpenses participant={participant} />

                    <CanProvideBackline participant={participant} />

                    <TechnicalRider participant={participant} />

                    <AdditionalInfo participant={participant} />
                </div>
            )}

            <div
                className="relative mt-1 flex justify-center rounded-md p-1 text-gray-800 shadow-lg backdrop-blur-2xl hover:brightness-110 md:hover:cursor-pointer"
                onClick={onCloseClick}
            >
                <FontAwesomeIcon className="w-5" icon={faTimes} />
            </div>
        </div>
    );
};

export default Details;
