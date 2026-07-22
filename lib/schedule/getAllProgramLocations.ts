import prismaClient from '@/lib/common/prismaClient';
import serializeProgramLocation from '@/lib/schedule/serializeProgramLocation';
import type { SerializableProgramLocation } from '@/typings/SerializableProgramLocation';

const getAllProgramLocations = async (includeInactive = true): Promise<Array<SerializableProgramLocation>> => {
    const programLocations = await prismaClient.programLocation.findMany({
        include: { programLocationArea: true },
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }, { id: 'asc' }],
        where: includeInactive ? undefined : { isActive: true },
    });

    return programLocations.map(serializeProgramLocation);
};

export default getAllProgramLocations;
