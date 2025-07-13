import ParticipantDetails from '@/components/participants/details/ParticipantDetails';
import ParticipantPreview from '@/components/participants/overview/ParticipantPreview';
import { useParticipantsOverviewContext } from '@/components/participants/overview/ParticipantsOverviewContext';
import type { SerializableParticipant } from '@/typings/SerializableParticipant';
import { ReactElement, useCallback, useState } from 'react';

interface Props {
    participant: SerializableParticipant;
    isLoggedIn: boolean;
}

const ParticipantOverview = ({ participant, isLoggedIn }: Props): ReactElement => {
    const { enhancedParticipantIds, toggleEnhancedParticipantId, getLinksOfParticipant } = useParticipantsOverviewContext();

    const [isEnhanced, setIsEnhanced] = useState(false);

    const { id } = participant;

    const handleEnhancedToggle = useCallback(() => setIsEnhanced((prevState) => !prevState), []);

    if (isEnhanced) {
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
