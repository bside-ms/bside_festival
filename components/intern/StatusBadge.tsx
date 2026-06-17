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
        <span className={cn('inline-flex rounded-full border px-2 py-0.5 text-xs font-bold', colors.badge, colors.border, colors.text)}>
            {statusLabels[status]}
        </span>
    );
};

export default StatusBadge;
