'use client';

import { ApplicationNameForm } from '@/components/applications/applicationCuration/ApplicationNameAndDescriptionForm';
import { useInternWorkspaceContext } from '@/components/intern/InternWorkspaceContext';
import ContributionDetails from '@/components/intern/ContributionDetails';
import StatusTransitionPanel from '@/components/intern/StatusTransitionPanel';
import Badge from '@/components/participants/details/Badge';
import cn from '@/lib/common/helper/cn';
import typeColors from '@/lib/participants/typeColors';
import typeLabels from '@/lib/participants/typeLabels';
import type { SerializableParticipant } from '@/typings/SerializableParticipant';
import type { MouseEvent, ReactElement } from 'react';
import { useCallback } from 'react';

interface Props {
    application: SerializableParticipant;
}

const formatAppliedAt = (appliedAt: string | null): string => {
    if (appliedAt === null) {
        return 'ohne Datum';
    }

    return new Date(appliedAt).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' });
};

const OrganizerInitials = ({ name }: { name: string }): ReactElement => (
    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-black bg-white text-xs font-bold" title={name}>
        {name
            .split(' ')
            .map((part) => part.slice(0, 1))
            .join('')
            .slice(0, 2)
            .toLocaleUpperCase('de-DE')}
    </span>
);

const ContributionCard = ({ application }: Props): ReactElement => {
    const { expandedIds, getGenres, toggleExpanded } = useInternWorkspaceContext();
    const isExpanded = expandedIds.includes(application.id);
    const genres = getGenres(application.id);
    const visibleOrganizers = application.organizers.slice(0, 3);
    const hiddenOrganizerCount = application.organizers.length - visibleOrganizers.length;
    const handleToggle = useCallback(() => toggleExpanded(application.id), [application.id, toggleExpanded]);
    const handleInteractiveClick = useCallback((event: MouseEvent<HTMLDivElement>) => event.stopPropagation(), []);

    return (
        <article id={`intern-application-${application.id}`} className="overflow-hidden rounded-md border border-black bg-white shadow-sm">
            <div className="grid cursor-pointer gap-3 p-3 lg:grid-cols-[minmax(0,1fr)_auto]" onClick={handleToggle}>
                <div className="min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge label={typeLabels[application.type]} backgroundColor={typeColors[application.type]} />
                        {genres.map(({ id, name }) => (
                            <Badge key={id} label={name} backgroundColor="#fcb8b8" />
                        ))}
                    </div>

                    <ApplicationNameForm application={application} />

                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
                        <span>Beworben am {formatAppliedAt(application.appliedAt)}</span>
                        <span>{application.comments.length} Kommentare</span>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                    <div className="flex -space-x-2">
                        {visibleOrganizers.map(({ organizerName, organizerUserId }) => (
                            <OrganizerInitials key={organizerUserId} name={organizerName} />
                        ))}
                        {hiddenOrganizerCount > 0 && (
                            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-black bg-black text-xs font-bold text-white">
                                +{hiddenOrganizerCount}
                            </span>
                        )}
                    </div>

                    <div onClick={handleInteractiveClick}>
                        <StatusTransitionPanel currentStatus={application.status} participantId={application.id} />
                    </div>

                    <span className={cn('text-xl transition-transform', isExpanded && 'rotate-180')}>⌄</span>
                </div>
            </div>

            {isExpanded && <ContributionDetails application={application} onCloseClick={handleToggle} />}
        </article>
    );
};

export default ContributionCard;
