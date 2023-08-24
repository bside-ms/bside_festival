import { Type } from '@prisma/client';

const availableTypes = new Array<Type>(
    Type.Concert,
    Type.Workshop,
    Type.Reading,
    Type.Performance,
    Type.FamilyProgram,
    Type.Exhibition,
    Type.Catering,
    Type.InfoBooth,
    Type.Misc,
);

export default availableTypes;
