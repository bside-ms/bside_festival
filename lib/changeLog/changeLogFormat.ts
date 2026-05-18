import { changeLogTargetTypeLabels } from './changeLogLabels';
import type { ChangeLogChange, ChangeLogEvent } from './changeLogTypes';

const formatActor = (actorName: string | null | undefined, actorEmail: string | null | undefined): string => {
    if (actorName !== null && actorName !== undefined && actorName.trim().length > 0) {
        return actorEmail !== null && actorEmail !== undefined && actorEmail.trim().length > 0 ? `${actorName} (${actorEmail})` : actorName;
    }

    return actorEmail !== null && actorEmail !== undefined && actorEmail.trim().length > 0 ? actorEmail : 'Unbekannt';
};

const formatSingleChange = ({ label, next, previous }: ChangeLogChange): string =>
    `${label} von "${previous.display}" zu "${next.display}"`;

export const formatChangeLogMessage = (
    event: ChangeLogEvent,
    actorName: string | null | undefined,
    actorEmail: string | null | undefined,
): string => {
    const targetLabel = changeLogTargetTypeLabels[event.target.type];
    const target = `${targetLabel} #${event.target.id} "${event.target.name}"`;
    const actor = formatActor(actorName, actorEmail);

    if (event.changes.length === 1) {
        const change = event.changes[0];

        if (change !== undefined) {
            return `${actor} hat ${formatSingleChange(change)} für ${target} geändert.`;
        }
    }

    return `${actor} hat ${event.changes.length} Felder für ${target} geändert: ${event.changes.map(formatSingleChange).join('; ')}.`;
};
