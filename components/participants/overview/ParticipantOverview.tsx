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
    const { getLinksOfParticipant, participantGenres, allGenres } = useParticipantsOverviewContext();

    const [isEnhanced, setIsEnhanced] = useState(false);

    const { id } = participant;

    const ownParticipantGenreIds = participantGenres.filter((genre) => genre.participantId === id).map((genre) => genre.genreId);

    const genres = allGenres.filter((genre) => ownParticipantGenreIds.includes(genre.id));

    const handleEnhancedToggle = useCallback(() => setIsEnhanced((prevState) => !prevState), []);

    if (isEnhanced) {
        return (
            <ParticipantDetails
                participant={participant}
                genres={genres}
                links={getLinksOfParticipant(id)}
                onCloseClick={handleEnhancedToggle}
                isLoggedIn={isLoggedIn}
            />
        );
    }

    return <ParticipantPreview participant={participant} genres={genres} isLoggedIn={isLoggedIn} onClick={handleEnhancedToggle} />;
};

export default ParticipantOverview;
