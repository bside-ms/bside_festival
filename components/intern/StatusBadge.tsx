import cn from '@/lib/common/helper/cn';
import statusColors from '@/lib/participants/status/statusColors';
import statusLabels from '@/lib/participants/status/statusLabels';
import type { ApplicationStatus } from '@prisma/client';
import type { ReactElement } from 'react';

interface Props {
    status: ApplicationStatus;
}

const StatusBadge = ({ status }: Props): ReactElement => {
    const colors = statusColors[status];

    return (
        <span
            className={cn(
                'inline-block max-w-full truncate rounded border border-black/20 px-1.5 py-0.5 text-xs font-bold',
                colors.badge,
                colors.text,
            )}
        >
            {statusLabels[status]}
        </span>
    );
};

export default StatusBadge;
