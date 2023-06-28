import type { Participant } from '@prisma/client';

export type SerializableParticipant = Omit<Participant, 'appliedAt' | 'updatedAt'> & { updatedAt: string, appliedAt: string | null };
