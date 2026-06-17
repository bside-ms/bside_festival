import type { Participant } from '@prisma/client';
import type { SerializableComment } from './SerializableComment';

export type SerializableParticipant = Omit<Participant, 'appliedAt' | 'emailVerified' | 'juryVotes' | 'updatedAt'> & {
    appliedAt: string | null;
    comments: Array<SerializableComment>;
    emailVerified: string | null;
    juryVotes: Array<number> | null;
    organizers: Array<{ organizerName: string; organizerUserId: string }>;
    updatedAt: string;
};
