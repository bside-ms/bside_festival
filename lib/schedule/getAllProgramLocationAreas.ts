import prismaClient from '@/lib/common/prismaClient';
import type { SerializableProgramLocationArea } from '@/typings/SerializableProgramLocationArea';

const getAllProgramLocationAreas = async (): Promise<Array<SerializableProgramLocationArea>> =>
    prismaClient.programLocationArea.findMany({
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
        select: { id: true, name: true, sortOrder: true },
    });

export default getAllProgramLocationAreas;
