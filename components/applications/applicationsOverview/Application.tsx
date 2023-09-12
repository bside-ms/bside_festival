import { useCallback } from 'react';
import type { ReactElement } from 'react';
import ApplicationDetails from 'components/applications/applicationDetails/ApplicationDetails';
import ApplicationPreview from 'components/applications/applicationPreview/ApplicationPreview';
import { useApplicationsOverviewContext } from 'components/applications/applicationsOverview/ApplicationsOverviewContext';
import type { SerializableParticipant } from 'typings/SerializableParticipant';

interface Props {
    application: SerializableParticipant;
}

const Application = ({ application }: Props): ReactElement => {
    const { enhancedApplicationIds, toggleEnhancedApplicationId, getLinksOfApplication, participantLabels, allLabels } =
        useApplicationsOverviewContext();

    const { id } = application;

    const ownParticipantLabelIds = participantLabels.filter((label) => label.participantId === id).map((label) => label.labelId);

    const labels = allLabels.filter((label) => ownParticipantLabelIds.includes(label.id));

    const handleEnhancedToggle = useCallback(() => toggleEnhancedApplicationId(id), [id, toggleEnhancedApplicationId]);

    if (enhancedApplicationIds.includes(id)) {
        return (
            <ApplicationDetails
                application={application}
                labels={labels}
                links={getLinksOfApplication(id)}
                onCloseClick={handleEnhancedToggle}
            />
        );
    }

    return <ApplicationPreview application={application} labels={labels} onClick={handleEnhancedToggle} />;
};

export default Application;
