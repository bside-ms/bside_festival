import { useParticipantsOverviewContext } from '@/components/participants/overview/ParticipantsOverviewContext';
import cn from '@/lib/common/helper/cn';
import { faThumbtack } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { ReactElement, SyntheticEvent } from 'react';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

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
            <button
                onClick={handleToggleClick}
                className={cn(
                    'absolute',
                    'right-2',
                    'top-2',
                    'z-50',
                    'flex',
                    'size-10',
                    'items-center',
                    'justify-center',
                    'rounded-full',
                    'bg-black/80',
                    'p-3',
                    'leading-3',
                    'text-gray-200',
                    'hover:bg-black/70',
                )}
            >
                <FontAwesomeIcon icon={faThumbtack} />
            </button>
        );
    }

    return (
        <button
            onClick={handleToggleClick}
            className={cn(
                'absolute',
                'right-2',
                'top-2',
                'z-50',
                'flex',
                'size-10',
                'items-center',
                'justify-center',
                'rounded-full',
                'bg-white/50',
                'p-3',
                'leading-3',
                'text-gray-600',
                'hover:bg-white/60',
            )}
        >
            <FontAwesomeIcon icon={faThumbtack} className="rotate-45" />
        </button>
    );
};

export default PinParticipantToggle;
