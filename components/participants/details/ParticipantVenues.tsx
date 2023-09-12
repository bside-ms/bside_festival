import type { ReactElement } from 'react';
import ParticipantVenue from 'components/participants/details/ParticipantVenue';
import { useParticipantVenues } from 'components/participants/overview/ParticipantsOverviewContext';

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
        <div className="mt-3 space-y-1">
            {participantVenues.map(({ location }) => (
                <ParticipantVenue key={location.id} location={location} showAccessibleInfo={!isInPreview} />
            ))}
        </div>
    );
};

export default ParticipantVenues;
