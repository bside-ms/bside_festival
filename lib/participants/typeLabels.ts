import type { Type } from '@prisma/client';

const typeLabels: Record<Type, string> = {
    Concert: 'Musik',
    DiskJockey: 'DJ',
    Workshop: 'Workshops & (interaktive) Infostände',
    Reading: 'Lesungen, Vorträge & Poesie',
    Performance: 'Performance, Theater & Kabarett',
    FamilyProgram: 'Familienprogramm',
    Exhibition: 'Ausstellung',
    Food: 'Essensstand',
    Neighbor: 'Nachbarschaft',
    Misc: 'Sonstiges',
    InfoBooth: 'Infostand',
    Catering: 'Catering',
};

export const typeLabelsWithSoftHyphens: Record<Type, string> = {
    ...typeLabels,
    Workshop: 'Workshops & (inter&shy;aktive) Infostände',
    FamilyProgram: 'Familien&shy;programm',
};

export default typeLabels;
