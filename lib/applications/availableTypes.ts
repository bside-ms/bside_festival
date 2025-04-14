import { Type } from '@prisma/client';

const typeOrder = new Array<Type>(
    Type.Concert,
    Type.DiskJockey,
    Type.FamilyProgram,
    Type.Exhibition,
    Type.Reading,
    Type.Performance,
    Type.Workshop,
    Type.InfoBooth,
);

const isTypeAvailable = (type: Type): boolean => {
    switch (type) {
        case Type.Concert:
        case Type.Workshop:
        case Type.Reading:
        case Type.Performance:
        case Type.FamilyProgram:
        case Type.Misc:
        case Type.Exhibition:
        case Type.DiskJockey:
        case Type.InfoBooth:
            return true;

        case Type.Catering:
        case Type.Neighbor:
        case Type.Food:
            return false;
    }
};

const availableTypes = Object.values(Type)
    .filter(isTypeAvailable)
    .sort((typeA, typeB) =>
        typeOrder.indexOf(typeA) === -1 ? 1 : typeOrder.indexOf(typeB) === -1 ? -1 : typeOrder.indexOf(typeA) - typeOrder.indexOf(typeB),
    );

export default availableTypes;
