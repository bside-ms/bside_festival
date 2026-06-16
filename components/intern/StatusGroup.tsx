'use client';

import { useInternWorkspaceContext } from '@/components/intern/InternWorkspaceContext';
import ContributionCard from '@/components/intern/ContributionCard';
import StatusBadge from '@/components/intern/StatusBadge';
import cn from '@/lib/common/helper/cn';
import statusColors from '@/lib/participants/status/statusColors';
import type { SerializableParticipant } from '@/typings/SerializableParticipant';
import type { ApplicationStatus } from '@prisma/client';
import type { ReactElement } from 'react';
import { useCallback } from 'react';

interface Props {
    applications: Array<SerializableParticipant>;
    status: ApplicationStatus;
}

const StatusGroup = ({ applications, status }: Props): ReactElement => {
    const { collapsedStatusGroups, toggleStatusGroup } = useInternWorkspaceContext();
    const isCollapsed = collapsedStatusGroups.includes(status);
    const colors = statusColors[status];
    const handleToggle = useCallback(() => toggleStatusGroup(status), [status, toggleStatusGroup]);

    return (
        <section className="overflow-hidden rounded-md border border-black bg-white/70 shadow-lg backdrop-blur-2xl">
            <button
                type="button"
                className={cn(
                    'flex w-full cursor-pointer items-center justify-between gap-3 border-b border-black p-3 text-left',
                    colors.header,
                )}
                onClick={handleToggle}
            >
                <div className="flex items-center gap-2">
                    <StatusBadge status={status} />
                    <span className="rounded-full bg-white/80 px-2 py-0.5 text-xs font-bold">({applications.length})</span>
                </div>
                <span className={cn('text-xl transition-transform', isCollapsed && '-rotate-90')}>⌄</span>
            </button>

            {!isCollapsed && (
                <div className="space-y-3 p-3">
                    {applications.map((application) => (
                        <ContributionCard key={application.id} application={application} />
                    ))}
                </div>
            )}
        </section>
    );
};

export default StatusGroup;
