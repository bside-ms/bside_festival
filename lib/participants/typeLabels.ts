import type { Type } from '@prisma/client';

const typeLabels: Record<Type, string> = {
    Concert: 'Konzert',
    Workshop: 'Workshop',
    Reading: 'Lesung',
    Performance: 'Performance',
    FamilyProgram: 'Familienprogramm',
    Exhibition: 'Ausstellung',
    Food: 'Essensstand',
    Neighbor: 'Nachbarschaft',
    Misc: 'Sonstiges',
};

export default typeLabels;
