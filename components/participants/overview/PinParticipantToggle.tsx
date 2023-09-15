import { useCallback } from 'react';
import { toast } from 'react-toastify';
import { faThumbtack } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { ReactElement, SyntheticEvent } from 'react';
import { useParticipantsOverviewContext } from 'components/participants/overview/ParticipantsOverviewContext';

interface Props {
    participantId: number;
}

const PinParticipantToggle = ({ participantId }: Props): ReactElement => {
    const { pinnedParticipantIds, togglePinnedParticipantId } = useParticipantsOverviewContext();

    const handleToggleClick = useCallback(
        (event: SyntheticEvent) => {
            if (!pinnedParticipantIds.includes(participantId)) {
                toast('Programmpunkt oben angepinnt!');
            }

            event.preventDefault();
            event.stopPropagation();
            togglePinnedParticipantId(participantId);
        },
        [participantId, pinnedParticipantIds, togglePinnedParticipantId],
    );

    if (pinnedParticipantIds.includes(participantId)) {
        return (
            <div
                onClick={handleToggleClick}
                className="absolute top-2 right-2 z-50 w-10 h-10 bg-gray-600 text-gray-200 flex justify-center items-center p-3 rounded-full leading-3"
            >
                <FontAwesomeIcon icon={faThumbtack} />
            </div>
        );
    }

    return (
        <div
            onClick={handleToggleClick}
            className="absolute top-2 right-2 z-50 w-10 h-10 bg-gray-200 text-gray-600 flex justify-center items-center p-3 rounded-full leading-3"
        >
            <FontAwesomeIcon icon={faThumbtack} className="rotate-45" />
        </div>
    );
};

export default PinParticipantToggle;
