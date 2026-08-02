import type { ActionUser } from '@/lib/actions/actionAuth';
import prismaClient from '@/lib/common/prismaClient';
import getUserSession from '@/lib/next-auth/getUserSession';
import type { Prisma } from '@prisma/client';

import { sanitizeActionErrorContext } from './sanitizeActionErrorContext';

export type ActionErrorTargetType = 'Application' | 'ProgramLocation' | 'ScheduleEntry' | 'Volunteer';

export interface RecordActionErrorInput {
    source: string;
    error: unknown;
    actor?: ActionUser | null;
    targetType?: ActionErrorTargetType | null;
    targetId?: number | null;
    context?: unknown;
}

const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error && error.message.trim().length > 0) {
        return error.message;
    }

    if (typeof error === 'string' && error.trim().length > 0) {
        return error;
    }

    return 'Unknown action error';
};

const getErrorStack = (error: unknown): string | null => (error instanceof Error ? (error.stack ?? null) : null);

const resolveActor = async (actor: ActionUser | null | undefined): Promise<ActionUser | null> => {
    if (actor) {
        return actor;
    }

    try {
        return await getUserSession();
    } catch {
        return null;
    }
};

export const recordActionError = async ({
    source,
    error,
    actor,
    targetType = null,
    targetId = null,
    context,
}: RecordActionErrorInput): Promise<void> => {
    const message = getErrorMessage(error);
    const stack = getErrorStack(error);

    console.error(`[ActionError] ${source}:`, error);

    const resolvedActor = await resolveActor(actor);
    const sanitizedContext = context === undefined ? undefined : sanitizeActionErrorContext(context);

    try {
        await prismaClient.actionErrorLogEntry.create({
            data: {
                actorEmail: resolvedActor?.email ?? null,
                actorName: resolvedActor?.name ?? null,
                context: sanitizedContext === undefined ? undefined : (sanitizedContext as Prisma.InputJsonValue),
                message,
                source,
                stack,
                targetId: targetId ?? null,
                targetType: targetType ?? null,
            },
        });
    } catch (persistError) {
        console.error(`[ActionError] Failed to persist ${source}:`, persistError);
    }
};
