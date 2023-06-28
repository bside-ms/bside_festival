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

    const { enhancedApplicationIds, toggleEnhancedApplicationId, getLinksOfApplication } = useApplicationsOverviewContext();

    const { id } = application;

    const handleEnhancedToggle = useCallback(
        () => toggleEnhancedApplicationId(id),
        [id, toggleEnhancedApplicationId]
    );

    if (enhancedApplicationIds.includes(id)) {
        return (
            <ApplicationDetails
                application={application}
                links={getLinksOfApplication(id)}
                onCloseClick={handleEnhancedToggle}
            />
        );
    }

    return (
        <ApplicationPreview
            application={application}
            onClick={handleEnhancedToggle}
        />
    );
};

export default Application;
