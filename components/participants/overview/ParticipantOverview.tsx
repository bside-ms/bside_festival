import { useCallback } from 'react';
import type { ReactElement } from 'react';
import ParticipantDetails from 'components/participants/details/ParticipantDetails';
import { useParticipantsOverviewContext } from 'components/participants/overview/ParticipantsOverviewContext';
import ParticipantPreview from 'components/participants/overview/ParticipantPreview';
import type { SerializableParticipant } from 'typings/SerializableParticipant';

interface Props {
    participant: SerializableParticipant;
    isLoggedIn: boolean;
}

const ParticipantOverview = ({ participant, isLoggedIn }: Props): ReactElement => {
    const { enhancedParticipantIds, toggleEnhancedParticipantId, getLinksOfParticipant } = useParticipantsOverviewContext();

    const { id } = participant;

    const handleEnhancedToggle = useCallback(() => toggleEnhancedParticipantId(id), [id, toggleEnhancedParticipantId]);

    if (enhancedParticipantIds.includes(id)) {
        return (
            <ParticipantDetails
                participant={participant}
                links={getLinksOfParticipant(id)}
                onCloseClick={handleEnhancedToggle}
                isLoggedIn={isLoggedIn}
            />
        );
    }

    return <ParticipantPreview participant={participant} onClick={handleEnhancedToggle} />;
};

export default ParticipantOverview;
