import type StrapiCollectionType from 'lib/strapi/typings/StrapiCollectionType';

const getLabelFromCollectionType = (strapiCollectionType: StrapiCollectionType): string => {

    switch (strapiCollectionType) {
        case 'concert':
        case 'concert-artists':
            return 'Konzert';

        case 'workshop':
        case 'workshops-organizers':
            return 'Workshop';

        case 'reading':
        case 'reading-artists':
            return 'Lesung';

        case 'performance-artists':
        case 'performance':
            return 'Performance';

        case 'family-program':
        case 'family-program-organizers':
            return 'Familienprogramm';

        case 'exhibition':
        case 'exhibition-artist':
            return 'Ausstellung';
    }
};

export default getLabelFromCollectionType;
