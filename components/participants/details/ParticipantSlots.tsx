import type { ReactElement } from 'react';
import ParticipantSlot from 'components/participants/details/ParticipantSlot';
import type { ParticipantSlot as IParticipantSlot } from 'components/participants/overview/ParticipantsOverviewContext';

interface Props {
    participantSlots: Array<IParticipantSlot>;
    isInPreview?: boolean;
}

const ParticipantSlots = ({ participantSlots, isInPreview = false }: Props): ReactElement | null => {

    return (
        <div className="mt-3 space-y-1">
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
