import ApplicationDetails from '@/components/applications/applicationDetails/ApplicationDetails';
import ApplicationPreview from '@/components/applications/applicationPreview/ApplicationPreview';
import { useApplicationsOverviewContext } from '@/components/applications/applicationsOverview/ApplicationsOverviewContext';
import type { SerializableParticipant } from '@/typings/SerializableParticipant';
import type { ReactElement } from 'react';
import { useCallback } from 'react';

interface Props {
    application: SerializableParticipant;
}

const Application = ({ application }: Props): ReactElement => {
    const { enhancedApplicationIds, toggleEnhancedApplicationId, getLinksOfApplication, participantGenres, allGenres } =
        useApplicationsOverviewContext();

    const { id } = application;

    const ownParticipantGenreIds = participantGenres.filter((genre) => genre.participantId === id).map((genre) => genre.genreId);

    const genres = allGenres.filter((genre) => ownParticipantGenreIds.includes(genre.id));

    const handleEnhancedToggle = useCallback(() => toggleEnhancedApplicationId(id), [id, toggleEnhancedApplicationId]);

    if (enhancedApplicationIds.includes(id)) {
        return (
            <ApplicationDetails
                application={application}
                genres={genres}
                links={getLinksOfApplication(id)}
                onCloseClick={handleEnhancedToggle}
            />
        );
    }

    return <ApplicationPreview application={application} genres={genres} onClick={handleEnhancedToggle} />;
};

export default Application;
