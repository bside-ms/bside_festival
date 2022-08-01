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
    }
};

export default getLabelFromCollectionType;
