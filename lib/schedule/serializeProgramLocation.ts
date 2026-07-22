import type { SerializableProgramLocation } from '@/typings/SerializableProgramLocation';
import type { ProgramLocation, ProgramLocationArea } from '@prisma/client';

type ProgramLocationWithArea = ProgramLocation & {
    programLocationArea: ProgramLocationArea | null;
};

const serializeProgramLocation = (programLocation: ProgramLocationWithArea): SerializableProgramLocation => ({
    ...programLocation,
    createdAt: programLocation.createdAt.toString(),
    updatedAt: programLocation.updatedAt.toString(),
    areaName: programLocation.programLocationArea?.name ?? null,
    programLocationArea:
        programLocation.programLocationArea === null
            ? null
            : {
                  id: programLocation.programLocationArea.id,
                  name: programLocation.programLocationArea.name,
                  sortOrder: programLocation.programLocationArea.sortOrder,
              },
});

export default serializeProgramLocation;
