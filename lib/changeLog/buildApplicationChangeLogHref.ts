import { ChangeLogTargetType } from '@prisma/client';

export const buildApplicationChangeLogHref = (applicationId: number): string => {
    const params = new URLSearchParams({
        targetId: applicationId.toString(),
        targetType: ChangeLogTargetType.Application,
    });

    return `/aenderungslog?${params.toString()}`;
};
