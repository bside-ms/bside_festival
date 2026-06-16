'use client';

import StatusBadge from '@/components/intern/StatusBadge';
import { setApplicationStatus } from '@/lib/actions/applicationActions';
import cn from '@/lib/common/helper/cn';
import statusLabels from '@/lib/participants/status/statusLabels';
import { prominentStatusTransitions, secondaryStatusTransitions } from '@/lib/participants/status/statusTransitionVisibility';
import type { ApplicationStatus } from '@prisma/client';
import type { ChangeEvent, MouseEvent, ReactElement } from 'react';
import { useCallback, useMemo, useState, useTransition } from 'react';

interface Props {
    currentStatus: ApplicationStatus;
    participantId: number;
    size?: 'compact' | 'full';
}

const StatusTransitionButton = ({
    isSelected,
    label,
    onSelect,
    status,
}: {
    isSelected: boolean;
    label: string;
    onSelect: (status: ApplicationStatus) => void;
    status: ApplicationStatus;
}): ReactElement => {
    const handleClick = useCallback(() => onSelect(status), [onSelect, status]);

    return (
        <button
            type="button"
            className={cn(
                'cursor-pointer rounded-full border border-black bg-white px-3 py-1 text-xs font-bold hover:bg-yellow-50',
                isSelected && 'bg-black text-white hover:bg-black',
            )}
            onClick={handleClick}
        >
            {label}
        </button>
    );
};

const StatusTransitionPanel = ({ currentStatus, participantId, size = 'compact' }: Props): ReactElement => {
    const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus | null>(null);
    const [commentText, setCommentText] = useState('');
    const [isPending, startTransition] = useTransition();

    const allStatuses = useMemo(() => [...prominentStatusTransitions, ...secondaryStatusTransitions], []);
    const visibleTransitionStatuses = useMemo(() => allStatuses.filter((status) => status !== currentStatus), [allStatuses, currentStatus]);
    const selectValue = selectedStatus ?? currentStatus;

    const handleCommentChange = useCallback((event: ChangeEvent<HTMLTextAreaElement>) => setCommentText(event.target.value), []);
    const handleStatusSelectChange = useCallback(
        (event: ChangeEvent<HTMLSelectElement>) => {
            const value = event.target.value as ApplicationStatus;

            if (value === currentStatus) {
                setSelectedStatus(null);
                return;
            }

            setSelectedStatus(value);
        },
        [currentStatus],
    );
    const handleCancel = useCallback(() => {
        setCommentText('');
        setSelectedStatus(null);
    }, []);
    const handleSelectedStatusChange = useCallback((status: ApplicationStatus) => setSelectedStatus(status), []);
    const handlePanelClick = useCallback((event: MouseEvent<HTMLDivElement>) => event.stopPropagation(), []);
    const handleSubmit = useCallback(() => {
        if (selectedStatus === null) {
            return;
        }

        startTransition(async () => {
            await setApplicationStatus(participantId, selectedStatus, commentText);
            setCommentText('');
            setSelectedStatus(null);
        });
    }, [commentText, participantId, selectedStatus]);

    const statusChangeForm =
        selectedStatus !== null ? (
            <div className="space-y-2 rounded border border-black/20 bg-white p-2" onClick={handlePanelClick}>
                <div className="text-xs font-bold">Status ändern zu {statusLabels[selectedStatus]}</div>
                <textarea
                    value={commentText}
                    className="min-h-20 w-full rounded border border-black p-2 text-sm outline-0"
                    placeholder="Optionaler Kommentar"
                    onChange={handleCommentChange}
                />
                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        disabled={isPending}
                        className="cursor-pointer rounded border border-black bg-black px-3 py-1 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
                        onClick={handleSubmit}
                    >
                        Speichern
                    </button>
                    <button
                        type="button"
                        className="cursor-pointer rounded border border-black bg-white px-3 py-1 text-xs font-bold"
                        onClick={handleCancel}
                    >
                        Abbrechen
                    </button>
                </div>
            </div>
        ) : null;

    if (size === 'compact') {
        return (
            <div className="space-y-3 text-sm" onClick={handlePanelClick}>
                <select
                    value={selectValue}
                    disabled={isPending}
                    className="w-auto max-w-full cursor-pointer rounded border border-black bg-white px-3 py-1 text-xs font-bold"
                    aria-label="Status"
                    onChange={handleStatusSelectChange}
                >
                    {allStatuses.map((status) => (
                        <option key={status} value={status}>
                            {statusLabels[status]}
                        </option>
                    ))}
                </select>

                {statusChangeForm}
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={currentStatus} />

                {visibleTransitionStatuses.map((status) => (
                    <StatusTransitionButton
                        key={status}
                        isSelected={selectedStatus === status}
                        label={statusLabels[status]}
                        onSelect={handleSelectedStatusChange}
                        status={status}
                    />
                ))}
            </div>

            {statusChangeForm}
        </div>
    );
};

export default StatusTransitionPanel;
