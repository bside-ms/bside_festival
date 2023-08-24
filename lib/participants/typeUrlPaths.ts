import type { Type } from '@prisma/client';

const typeUrlPaths: Record<Type, string> = {
    Concert: 'konzert',
    DiskJockey: 'dj',
    Workshop: 'workshop',
    Reading: 'lesung',
    Performance: 'performance',
    FamilyProgram: 'familienprogramm',
    Exhibition: 'ausstellung',
    Food: 'essensstand',
    Neighbor: 'nachbarschaft',
    Misc: 'sonstiges',
    InfoBooth: 'infostand',
    Catering: 'catering',
};

export default typeUrlPaths;
