import { useCallback } from 'react';
import { faThumbtack } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { ReactElement, SyntheticEvent } from 'react';
import { toast } from 'react-toastify';
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
                className="absolute right-2 top-2 z-50 flex size-10 items-center justify-center rounded-full bg-gray-600 p-3 leading-3 text-gray-200"
            >
                <FontAwesomeIcon icon={faThumbtack} />
            </div>
        );
    }

    return (
        <div
            onClick={handleToggleClick}
            className="absolute right-2 top-2 z-50 flex size-10 items-center justify-center rounded-full bg-gray-200 p-3 leading-3 text-gray-600"
        >
            <FontAwesomeIcon icon={faThumbtack} className="rotate-45" />
        </div>
    );
};

export default PinParticipantToggle;
