import type { Type } from '@prisma/client';

const typeColors: Record<Type, string> = {
    Concert: '#afefd4',
    Workshop: '#efb5b5',
    Reading: '#e9ea9d',
    Performance: '#9ec8e0',
    FamilyProgram: '#de98c6',
    Exhibition: '#f3c8df',
    Food: '#d28218',
    Neighbor: '#a192a6',
    Misc: '#8b9ebd',
};

export default typeColors;
