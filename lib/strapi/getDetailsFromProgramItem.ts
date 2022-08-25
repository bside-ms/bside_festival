import ApplicationType from 'lib/application-form/ApplicationType';
import type FullTimeProgramItem from 'lib/strapi/typings/FullTimeProgramItem';
import type GenericImagesData from 'lib/strapi/typings/GenericImagesData';
import type ProgramItem from 'lib/strapi/typings/ProgramItem';
import type StrapiCollectionType from 'lib/strapi/typings/StrapiCollectionType';

interface ProgramItemDetails {
    artistId: number | null;
    artistName: string | null;
    artistImages: GenericImagesData['data'];
    collectionType: StrapiCollectionType;
    applicationType: ApplicationType;
}

// eslint-disable-next-line complexity
const getDetailsFromProgramItem = (programItem: ProgramItem | FullTimeProgramItem): ProgramItemDetails => {

    if ('concert_artist' in programItem.attributes) {
        return {
            artistId: programItem.attributes.concert_artist.data?.id ?? null,
            artistName: programItem.attributes.concert_artist.data?.attributes.Name ?? null,
            artistImages: programItem.attributes.concert_artist.data?.attributes.Images.data ?? null,
            collectionType: 'concert',
            applicationType: ApplicationType.konzert,
        };
    }
    if ('workshop_organizer' in programItem.attributes) {
        return {
            artistId: programItem.attributes.workshop_organizer.data?.id ?? null,
            artistName: programItem.attributes.workshop_organizer.data?.attributes.Name ?? null,
            artistImages: programItem.attributes.workshop_organizer.data?.attributes.Images.data ?? null,
            collectionType: 'workshop',
            applicationType: ApplicationType.workshop,
        };
    }
    if ('reading_artist' in programItem.attributes) {
        return {
            artistId: programItem.attributes.reading_artist.data?.id ?? null,
            artistName: programItem.attributes.reading_artist.data?.attributes.Name ?? null,
            artistImages: programItem.attributes.reading_artist.data?.attributes.Images.data ?? null,
            collectionType: 'reading',
            applicationType: ApplicationType.lesung,
        };
    }
    if ('performance_artist' in programItem.attributes) {
        return {
            artistId: programItem.attributes.performance_artist.data?.id ?? null,
            artistName: programItem.attributes.performance_artist.data?.attributes.Name ?? null,
            artistImages: programItem.attributes.performance_artist.data?.attributes.Images.data ?? null,
            collectionType: 'performance',
            applicationType: ApplicationType.performance,
        };
    }
    if ('family_program_organizer' in programItem.attributes) {
        return {
            artistId: programItem.attributes.family_program_organizer.data?.id ?? null,
            artistName: programItem.attributes.family_program_organizer.data?.attributes.Name ?? null,
            artistImages: programItem.attributes.family_program_organizer.data?.attributes.Images.data ?? null,
            collectionType: 'family-program',
            applicationType: ApplicationType.familienprogramm,
        };
    }
    if ('exhibition_artist' in programItem.attributes) {
        return {
            artistId: programItem.attributes.exhibition_artist.data?.id ?? null,
            artistName: programItem.attributes.exhibition_artist.data?.attributes.Name ?? null,
            artistImages: programItem.attributes.exhibition_artist.data?.attributes.Images.data ?? null,
            collectionType: 'exhibition',
            applicationType: ApplicationType.ausstellung,
        };
    }
    if ('information_booth_organizer' in programItem.attributes) {
        return {
            artistId: programItem.attributes.information_booth_organizer.data?.id ?? null,
            artistName: programItem.attributes.information_booth_organizer.data?.attributes.Name ?? null,
            artistImages: programItem.attributes.information_booth_organizer.data?.attributes.Images.data ?? null,
            collectionType: 'information-booth',
            applicationType: ApplicationType.infostand,
        };
    }
    if ('food_organizer' in programItem.attributes) {
        return {
            artistId: programItem.attributes.food_organizer.data?.id ?? null,
            artistName: programItem.attributes.food_organizer.data?.attributes.Name ?? null,
            artistImages: programItem.attributes.food_organizer.data?.attributes.Images.data ?? null,
            collectionType: 'food',
            applicationType: ApplicationType.essensstand,
        };
    }

    throw new Error(`Received unexpected program item: ${JSON.stringify(programItem)}`);
};

export default getDetailsFromProgramItem;
