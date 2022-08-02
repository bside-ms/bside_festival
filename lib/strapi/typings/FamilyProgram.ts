import type FamilyProgramOrganizer from 'lib/strapi/typings/FamilyProgramOrganizer';
import type Location from 'lib/strapi/typings/Location';

export default interface FamilyProgram {
    id: number;
    attributes: {
        Date: string;
        Begin: string;
        End: string;
        family_program_organizer: { data: FamilyProgramOrganizer | null };
        location: { data: Location | null };
        publishedAt: string | null;
    };
}
