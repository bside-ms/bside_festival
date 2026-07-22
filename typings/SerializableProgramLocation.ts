import type { SerializableProgramLocationArea } from '@/typings/SerializableProgramLocationArea';
import type { ProgramLocation } from '@prisma/client';

export type SerializableProgramLocation = Omit<ProgramLocation, 'createdAt' | 'updatedAt'> & {
    createdAt: string;
    updatedAt: string;
    areaName: string | null;
    programLocationArea: SerializableProgramLocationArea | null;
};
