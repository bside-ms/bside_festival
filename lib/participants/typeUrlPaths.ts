import type { Type } from '@prisma/client';

const typeUrlPaths: Record<Type, string> = {
    Concert: 'konzert',
    Workshop: 'workshop',
    Reading: 'lesung',
    Performance: 'performance',
    FamilyProgram: 'familienprogramm',
    Exhibition: 'ausstellung',
    Food: 'essensstand',
    Neighbor: 'nachbarschaft',
    Misc: 'sonstiges',
};

export default typeUrlPaths;
