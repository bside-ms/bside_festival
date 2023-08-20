import type { ReactElement } from 'react';
import ParticipantSlot from 'components/participants/details/ParticipantSlot';
import { useParticipantSlots } from 'components/participants/overview/ParticipantsOverviewContext';

interface Props {
    participantId: number;
    isInPreview?: boolean;
}

const ParticipantSlots = ({ participantId, isInPreview = false }: Props): ReactElement | null => {

    const participantSlots = useParticipantSlots(participantId);

    if (participantSlots.length === 0) {
        return null;
    }

    return (
        <div className="mt-3">
            {participantSlots.map(({ location, slot }) => (
                <ParticipantSlot
                    key={slot.id}
                    slot={slot}
                    location={location}
                    showAccessibleInfo={!isInPreview}
                />
            ))}
        </div>
    );
};

export default ParticipantSlots;
