import type { Type } from '@prisma/client';

const urlPathTypes: Record<string, Type> = {
    konzert: 'Concert',
    dj: 'DiskJockey',
    workshop: 'Workshop',
    lesung: 'Reading',
    performance: 'Performance',
    familienprogramm: 'FamilyProgram',
    ausstellung: 'Exhibition',
    essensstand: 'Food',
    nachbarschaft: 'Neighbor',
    infostand: 'InfoBooth',
    catering: 'Catering',
    sonstiges: 'Misc',
};

export default urlPathTypes;
