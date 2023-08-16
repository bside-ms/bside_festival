import { useCallback } from 'react';
import type { ReactElement } from 'react';
import Details from 'components/participants/details/Details';
import { useParticipantsOverviewContext } from 'components/participants/overview/ParticipantsOverviewContext';
import ParticipantsPreview from 'components/participants/overview/ParticipantsPreview';
import type { SerializableParticipant } from 'typings/SerializableParticipant';

interface Props {
    participant: SerializableParticipant;
}

const ParticipantOverview = ({ participant }: Props): ReactElement => {

    const {
        enhancedParticipantIds,
        toggleEnhancedParticipantId,
        getLinksOfParticipant,
    } = useParticipantsOverviewContext();

    const { id } = participant;

    const handleEnhancedToggle = useCallback(
        () => toggleEnhancedParticipantId(id),
        [id, toggleEnhancedParticipantId]
    );

    if (enhancedParticipantIds.includes(id)) {
        return (
            <Details
                participant={participant}
                links={getLinksOfParticipant(id)}
                onCloseClick={handleEnhancedToggle}
            />
        );
    }

    return (
        <ParticipantsPreview
            participant={participant}
            onClick={handleEnhancedToggle}
        />
    );
};

export default ParticipantOverview;
