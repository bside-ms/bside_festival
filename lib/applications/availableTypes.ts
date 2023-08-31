import { Type } from '@prisma/client';

const isTypeAvailable = (type: Type): boolean => {

    switch (type) {
        case Type.Concert:
        case Type.Workshop:
        case Type.Reading:
        case Type.Performance:
        case Type.FamilyProgram:
        case Type.Exhibition:
        case Type.Catering:
        case Type.InfoBooth:
        case Type.Misc:
            return true;
        case Type.Neighbor:
        case Type.DiskJockey:
        case Type.Food:
            return false;
    }
};

const availableTypes = Object.values(Type).filter(isTypeAvailable);

export default availableTypes;
