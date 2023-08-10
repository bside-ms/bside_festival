import { useCallback } from 'react';
import type { ReactElement } from 'react';
import Details from 'components/participants/details/Details';
import { useApplicationsOverviewContext } from 'components/participants/overview/ParticipantsOverviewContext';
import ParticipantsPreview from 'components/participants/overview/ParticipantsPreview';
import type { SerializableParticipant } from 'typings/SerializableParticipant';

interface Props {
    application: SerializableParticipant;
}

const ParticipantOverview = ({ application }: Props): ReactElement => {

    const {
        enhancedApplicationIds,
        toggleEnhancedApplicationId,
        getLinksOfApplication,
    } = useApplicationsOverviewContext();

    const { id } = application;

    const handleEnhancedToggle = useCallback(
        () => toggleEnhancedApplicationId(id),
        [id, toggleEnhancedApplicationId]
    );

    if (enhancedApplicationIds.includes(id)) {
        return (
            <Details
                application={application}
                links={getLinksOfApplication(id)}
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
