import { Type } from '@prisma/client';

const hasSlotOrVenue = (type: Type): 'slot' | 'venue' => {
    switch (type) {
        case Type.Neighbor:
        case Type.Exhibition:
        case Type.InfoBooth:
        case Type.Catering:
        case Type.Food:
        case Type.FamilyProgram:
            return 'venue';

        case Type.Concert:
        case Type.Reading:
        case Type.DiskJockey:
        case Type.Workshop:
        case Type.Performance:
        case Type.Misc:
            return 'slot';
    }
};

export default hasSlotOrVenue;
