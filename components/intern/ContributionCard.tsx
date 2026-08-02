'use client';

import { useInternWorkspaceContext } from '@/components/intern/InternWorkspaceContext';
import StatusTransitionPanel from '@/components/intern/StatusTransitionPanel';
import Badge from '@/components/participants/details/Badge';
import formatDate from '@/lib/common/helper/formatDate';
import { withSearchParams } from '@/lib/intern/internFilterSearchParams';
import typeColors from '@/lib/participants/typeColors';
import typeLabels from '@/lib/participants/typeLabels';
import type { SerializableParticipant } from '@/typings/SerializableParticipant';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import type { MouseEvent, ReactElement } from 'react';
import { useCallback } from 'react';

interface Props {
    application: SerializableParticipant;
}

const formatAppliedAt = (appliedAt: string | null): string => {
    if (appliedAt === null) {
        return 'ohne Datum';
    }

    return formatDate(appliedAt, 'dd.MM.yy');
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
    const searchParams = useSearchParams();
    const { getGenres } = useInternWorkspaceContext();
    const genres = getGenres(application.id);
    const visibleOrganizers = application.organizers.slice(0, 3);
    const hiddenOrganizerCount = application.organizers.length - visibleOrganizers.length;
    const detailHref = withSearchParams(`/intern/${application.id}`, searchParams);
    const handleInteractiveClick = useCallback((event: MouseEvent<HTMLDivElement>) => event.stopPropagation(), []);

    return (
        <article className="overflow-hidden rounded-md border border-black bg-white shadow-sm">
            <div className="grid gap-3 p-3 lg:grid-cols-[minmax(0,1fr)_auto]">
                <Link href={detailHref} className="min-w-0 space-y-2 text-inherit no-underline">
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge label={typeLabels[application.type]} backgroundColor={typeColors[application.type]} />
                        {genres.map(({ id, name }) => (
                            <Badge key={id} label={name} backgroundColor="#fcb8b8" />
                        ))}
                    </div>

                    <div className="font-display text-2xl leading-tight uppercase">{application.name}</div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
                        <span>Beworben am {formatAppliedAt(application.appliedAt)}</span>
                    </div>
                </Link>

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

                    <Link href={detailHref} className="text-xl text-inherit no-underline" aria-label={`Details zu ${application.name}`}>
                        ›
                    </Link>
                </div>
            </div>
        </article>
    );
};

export default ContributionCard;
