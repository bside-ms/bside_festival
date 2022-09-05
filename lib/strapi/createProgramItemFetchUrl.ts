import qs from 'qs';

const createProgramItemFetchUrl = (
    pathName: string,
    withDateField: boolean,
    artistFieldName: string,
    isInFestivalGroup: boolean
): URL => {

    const url = new URL(process.env.STRAPI_BASE_URL!);

    url.pathname = `/api/${pathName}`;

    url.search = qs.stringify({
        fields: withDateField ? ['Date', 'Begin', 'End', 'publishedAt'] : ['Begin', 'End', 'publishedAt'],
        sort: withDateField ? ['Date', 'Begin'] : ['Begin'],
        populate: {
            [artistFieldName]: { populate: ['Images', 'Links'] },
            location: { populate: 'Images' },
            Registration: { populate: '*' },
        },
        publicationState: isInFestivalGroup ? 'preview' : 'live',
        pagination: {
            page: 1,
            pageSize: 1000,
        },
    }, {
        encodeValuesOnly: true,
    });

    return url;
};

export default createProgramItemFetchUrl;
