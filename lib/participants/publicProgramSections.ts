import type { Type } from '@prisma/client';

export interface PublicProgramSection {
    color: string;
    foregroundColor: string;
    id: string;
    label: string;
    types: Array<Type>;
}

const publicProgramSections: Array<PublicProgramSection> = [
    { id: 'music', label: 'Musik', types: ['Concert', 'DiskJockey'], color: '#EA504C', foregroundColor: '#FFFFFF' },
    { id: 'workshops', label: 'Workshops', types: ['Workshop'], color: '#FABF74', foregroundColor: '#2C2E83' },
    { id: 'readings', label: 'Lesungen, Vorträge & Poesie', types: ['Reading'], color: '#D681B4', foregroundColor: '#FFFFFF' },
    { id: 'performances', label: 'Performance, Theater & Kabarett', types: ['Performance'], color: '#40A8F5', foregroundColor: '#FFFFFF' },
    { id: 'family-program', label: 'Familienprogramm', types: ['FamilyProgram'], color: '#F2C48D', foregroundColor: '#2C2E83' },
    { id: 'exhibitions', label: 'Ausstellungen', types: ['Exhibition'], color: '#D681B4', foregroundColor: '#FFFFFF' },
    { id: 'food', label: 'Essensstände', types: ['Food'], color: '#EA504C', foregroundColor: '#FFFFFF' },
    { id: 'neighborhood', label: 'Nachbarschaft', types: ['Neighbor'], color: '#40A8F5', foregroundColor: '#FFFFFF' },
    { id: 'info-booths', label: 'Infostände', types: ['InfoBooth'], color: '#FABF74', foregroundColor: '#2C2E83' },
    { id: 'catering', label: 'Catering', types: ['Catering'], color: '#2C2E83', foregroundColor: '#FFFFFF' },
    { id: 'misc', label: 'Sonstiges', types: ['Misc'], color: '#D681B4', foregroundColor: '#FFFFFF' },
];

export const getPublicProgramSection = (type: Type): PublicProgramSection => {
    const section = publicProgramSections.find(({ types }) => types.includes(type));

    if (section === undefined) {
        throw new Error(`Missing public Program Section for type ${type}`);
    }

    return section;
};

export default publicProgramSections;
