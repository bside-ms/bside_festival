import type { ApplicationStatus } from '@prisma/client';

export interface SerializableComment {
    id: number;
    text: string;
    authorUserId: string;
    authorName: string;
    createdAt: string;
    statusTransition: ApplicationStatus | null;
}
