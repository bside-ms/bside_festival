import type { Participant } from '@prisma/client';

export type SerializableParticipant = Omit<Participant, 'appliedAt' | 'emailVerified' | 'updatedAt'> & {
    appliedAt: string | null;
    emailVerified: string | null;
    updatedAt: string;
};
