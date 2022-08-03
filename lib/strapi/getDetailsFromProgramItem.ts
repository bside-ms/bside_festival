import ApplicationType from 'lib/application-form/ApplicationType';
import type FullTimeProgramItem from 'lib/strapi/typings/FullTimeProgramItem';
import type ProgramItem from 'lib/strapi/typings/ProgramItem';
import type StrapiCollectionType from 'lib/strapi/typings/StrapiCollectionType';

// eslint-disable-next-line complexity
const getDetailsFromProgramItem = (programItem: ProgramItem | FullTimeProgramItem): [string | null, StrapiCollectionType, ApplicationType] => {

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
    if ('information_booth_organizer' in programItem.attributes) {
        return [
            programItem.attributes.information_booth_organizer.data?.attributes.Name ?? null,
            'information-booth',
            // There's no application type for info booth
            ApplicationType.workshop,
        ];
    }
    if ('food_organizer' in programItem.attributes) {
        return [
            programItem.attributes.food_organizer.data?.attributes.Name ?? null,
            'food',
            ApplicationType.essensstand,
        ];
    }

    throw new Error(`Received unexpected program item: ${JSON.stringify(programItem)}`);
};

export default getDetailsFromProgramItem;
