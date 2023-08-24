import type { Type } from '@prisma/client';

const typeLabels: Record<Type, string> = {
    Concert: 'Musik',
    DiskJockey: 'DJ',
    Workshop: 'Workshop',
    Reading: 'Lesung',
    Performance: 'Performance',
    FamilyProgram: 'Familienprogramm',
    Exhibition: 'Ausstellung',
    Food: 'Essensstand',
    Neighbor: 'Nachbarschaft',
    Misc: 'Sonstiges',
    InfoBooth: 'Infostand',
    Catering: 'Catering',
};

export default typeLabels;
