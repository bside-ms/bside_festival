import StatusBadge from '@/components/intern/StatusBadge';
import cn from '@/lib/common/helper/cn';
import statusColors from '@/lib/participants/status/statusColors';
import type { SerializableComment } from '@/typings/SerializableComment';
import type { ReactElement } from 'react';

interface Props {
    comments: Array<SerializableComment>;
}

const formatCreatedAt = (createdAt: string): string =>
    new Intl.DateTimeFormat('de-DE', {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: 'Europe/Berlin',
    }).format(new Date(createdAt));

const ActivityTimeline = ({ comments }: Props): ReactElement => {
    return (
        <div className="space-y-2">
            <div className="font-display text-xl">Aktivität</div>

            {comments.length === 0 ? (
                <div className="text-sm text-gray-500">Noch keine Kommentare.</div>
            ) : (
                <div className="space-y-2">
                    {comments.map((comment) => {
                        const colors = comment.statusTransition === null ? null : statusColors[comment.statusTransition];

                        return (
                            <div
                                key={comment.id}
                                className={cn(
                                    'rounded border bg-white p-3 text-sm',
                                    colors === null ? 'border-black/10' : colors.border,
                                    colors !== null && 'border-l-4',
                                )}
                            >
                                <div className="mb-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                                    <span className="font-bold text-black">{comment.authorName}</span>
                                    <span>{formatCreatedAt(comment.createdAt)}</span>
                                    {comment.statusTransition !== null && <StatusBadge status={comment.statusTransition} />}
                                </div>
                                <div className="whitespace-pre-wrap">{comment.text}</div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ActivityTimeline;
