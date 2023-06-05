import { Type } from '@prisma/client';

const availableTypes = new Array<Type>(
    Type.Concert,
    Type.Workshop,
    Type.Reading,
    Type.Performance,
    Type.FamilyProgram,
    Type.Exhibition,
    // Type.Food,
    // Type.Neighbor,
    Type.Misc,
);

export default availableTypes;
