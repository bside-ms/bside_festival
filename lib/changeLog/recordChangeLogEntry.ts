import type { ActionUser } from '@/lib/actions/actionAuth';
import type { Prisma } from '@prisma/client';
import { formatChangeLogMessage } from './changeLogFormat';
import type { ChangeLogEvent } from './changeLogTypes';

export const recordChangeLogEntry = async (tx: Prisma.TransactionClient, actor: ActionUser, event: ChangeLogEvent): Promise<void> => {
    if (event.changes.length === 0) {
        return;
    }

    await tx.changeLogEntry.create({
        data: {
            actorName: actor.name,
            actorEmail: actor.email,
            targetType: event.target.type,
            targetId: event.target.id,
            targetName: event.target.name,
            action: event.action,
            message: formatChangeLogMessage(event, actor.name, actor.email),
            changes: event.changes as unknown as Prisma.InputJsonValue,
        },
    });
};
