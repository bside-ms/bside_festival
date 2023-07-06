import type { Type } from '@prisma/client';

const urlPathTypes: Record<string, Type> = {
    konzert: 'Concert',
    workshop: 'Workshop',
    lesung: 'Reading',
    performance: 'Performance',
    familienprogramm: 'FamilyProgram',
    ausstellung: 'Exhibition',
    essensstand: 'Food',
    nachbarschaft: 'Neighbor',
    sonstiges: 'Misc',
};

export default urlPathTypes;
