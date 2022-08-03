import ApplicationType from 'lib/application-form/ApplicationType';
import type Exhibition from 'lib/strapi/typings/Exhibition';
import type ProgramItem from 'lib/strapi/typings/ProgramItem';
import type StrapiCollectionType from 'lib/strapi/typings/StrapiCollectionType';

const getDetailsFromProgramItem = (programItem: ProgramItem | Exhibition): [string | null, StrapiCollectionType, ApplicationType] => {

    if ('concert_artist' in programItem.attributes) {
        return [
            programItem.attributes.concert_artist.data?.attributes.Name ?? null,
            'concert',
            ApplicationType.konzert,
        ];
    }
    if ('workshop_organizer' in programItem.attributes) {
        return [
            programItem.attributes.workshop_organizer.data?.attributes.Name ?? null,
            'workshop',
            ApplicationType.workshop,
        ];
    }
    if ('reading_artist' in programItem.attributes) {
        return [
            programItem.attributes.reading_artist.data?.attributes.Name ?? null,
            'reading',
            ApplicationType.lesung,
        ];
    }
    if ('performance_artist' in programItem.attributes) {
        return [
            programItem.attributes.performance_artist.data?.attributes.Name ?? null,
            'performance',
            ApplicationType.performance,
        ];
    }
    if ('family_program_organizer' in programItem.attributes) {
        return [
            programItem.attributes.family_program_organizer.data?.attributes.Name ?? null,
            'family-program',
            ApplicationType.familienprogramm,
        ];
    }
    if ('exhibition_artist' in programItem.attributes) {
        return [
            programItem.attributes.exhibition_artist.data?.attributes.Name ?? null,
            'exhibition',
            ApplicationType.ausstellung,
        ];
    }

    throw new Error(`Received unexpected program item: ${JSON.stringify(programItem)}`);
};

export default getDetailsFromProgramItem;
