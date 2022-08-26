import ApplicationType from 'lib/application-form/ApplicationType';
import type StrapiCollectionType from 'lib/strapi/typings/StrapiCollectionType';

const getCollectionTypeFromApplicationType = (applicationType: ApplicationType): StrapiCollectionType => {

    switch (applicationType) {
        case ApplicationType.ausstellung:
            return 'exhibition-artists';
        case ApplicationType.performance:
            return 'performance-artists';
        case ApplicationType.konzert:
            return 'concert-artists';
        case ApplicationType.workshop:
            return 'workshop-organizers';
        case ApplicationType.infostand:
            return 'information-booth-organizers';
        case ApplicationType.familienprogramm:
            return 'family-program-organizers';
        case ApplicationType.lesung:
            return 'reading-artists';
        case ApplicationType.essensstand:
            return 'food-organizers';
        case ApplicationType.nachbarschaft:
        case ApplicationType.anderes:
            // @ts-expect-error | For now we ignore this..
            return '';
    }
};

export default getCollectionTypeFromApplicationType;
