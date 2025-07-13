import ParticipantSlot from '@/components/participants/details/ParticipantSlot';
import type { ParticipantSlot as IParticipantSlot } from '@/components/participants/overview/ParticipantsOverviewContext';
import type { ReactElement } from 'react';

interface Props {
    participantSlots: Array<IParticipantSlot>;
    isInPreview?: boolean;
}

const ParticipantSlots = ({ participantSlots, isInPreview = false }: Props): ReactElement | null => {
    return (
        <div className="space-y-1">
            {participantSlots.map(({ location, slot }) => (
                <ParticipantSlot key={slot.id} slot={slot} location={location} showAccessibleInfo={!isInPreview} />
            ))}
        </div>
    );
};

export default ParticipantSlots;
