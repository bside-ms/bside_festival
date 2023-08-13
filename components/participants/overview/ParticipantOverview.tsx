import { useCallback } from 'react';
import type { ReactElement } from 'react';
import Details from 'components/participants/details/Details';
import { useParticipantsOverviewContext } from 'components/participants/overview/ParticipantsOverviewContext';
import ParticipantsPreview from 'components/participants/overview/ParticipantsPreview';
import type { SerializableParticipant } from 'typings/SerializableParticipant';

interface Props {
    application: SerializableParticipant;
}

const ParticipantOverview = ({ application }: Props): ReactElement => {

    const {
        enhancedParticipantIds,
        toggleEnhancedParticipantId,
        getLinksOfParticipant,
    } = useParticipantsOverviewContext();

    const { id } = application;

    const handleEnhancedToggle = useCallback(
        () => toggleEnhancedParticipantId(id),
        [id, toggleEnhancedParticipantId]
    );

    if (enhancedParticipantIds.includes(id)) {
        return (
            <Details
                application={application}
                links={getLinksOfParticipant(id)}
                onCloseClick={handleEnhancedToggle}
            />
        );
    }

    return (
        <ParticipantsPreview
            application={application}
            onClick={handleEnhancedToggle}
        />
    );
};

export default ParticipantOverview;
