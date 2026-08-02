import type { ActionErrorTargetType, RecordActionErrorInput } from './recordActionError';
import { recordActionError } from './recordActionError';

type ActionErrorMeta = Omit<RecordActionErrorInput, 'source' | 'error'>;

export const loggedAction = <Fn extends (...args: never[]) => Promise<unknown>>(
    source: string,
    action: Fn,
    meta?: (...args: Parameters<Fn>) => ActionErrorMeta,
): ((...args: Parameters<Fn>) => ReturnType<Fn>) => {
    return ((...args: Parameters<Fn>): ReturnType<Fn> => {
        const run = async (): Promise<Awaited<ReturnType<Fn>>> => {
            try {
                return (await action(...args)) as Awaited<ReturnType<Fn>>;
            } catch (error) {
                await recordActionError({
                    source,
                    error,
                    ...(meta?.(...args) ?? {}),
                });
                throw error;
            }
        };

        return run() as ReturnType<Fn>;
    }) as (...args: Parameters<Fn>) => ReturnType<Fn>;
};

export const applicationActionMeta = (id: number, context?: unknown): ActionErrorMeta => ({
    targetType: 'Application' satisfies ActionErrorTargetType,
    targetId: id,
    context,
});
