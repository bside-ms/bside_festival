import type { Type } from '@prisma/client';

const typeLabels: Record<Type, string> = {
    Concert: 'Musik',
    DiskJockey: 'DJs',
    Workshop: 'Workshops',
    Reading: 'Lesungen, Vorträge & Poesie',
    Performance: 'Performance, Theater & Kabarett',
    FamilyProgram: 'Familienprogramm',
    Exhibition: 'Ausstellungen',
    Food: 'Essensstand',
    Neighbor: 'Nachbarschaft',
    Misc: 'Sonstiges',
    InfoBooth: 'Infostände',
    Catering: 'Catering',
};

export const typeLabelsWithSoftHyphens: Record<Type, string> = {
    ...typeLabels,
    Reading: 'Lesungen, Vorträge&nbsp;& Poesie',
    FamilyProgram: 'Familien&shy;programm',
    Performance: 'Performance, Theater&nbsp;& Kabarett',
};

export default typeLabels;
