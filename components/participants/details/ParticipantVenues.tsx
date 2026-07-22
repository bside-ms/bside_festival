import ParticipantVenue from '@/components/participants/details/ParticipantVenue';
import { useParticipantVenues } from '@/components/participants/overview/ParticipantsOverviewContext';
import type { ReactElement } from 'react';

interface Props {
    participantId: number;
    isInPreview?: boolean;
}

const ParticipantVenues = ({ participantId, isInPreview = false }: Props): ReactElement | null => {
    const participantVenues = useParticipantVenues(participantId);

    if (participantVenues.length === 0) {
        return null;
    }

    return (
        <div className="space-y-1">
            {participantVenues.map(({ programLocation, dates }) => (
                <ParticipantVenue
                    key={programLocation.id}
                    programLocation={programLocation}
                    dates={dates}
                    showAccessibleInfo={!isInPreview}
                />
            ))}
        </div>
    );
};

export default ParticipantVenues;
