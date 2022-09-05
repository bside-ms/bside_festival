import qs from 'qs';

const createFullTimeProgramItemFetchUrl = (
    pathName: string,
    artistFieldName: string,
    isInFestivalGroup: boolean
): URL => {

    const url = new URL(process.env.STRAPI_BASE_URL!);

    url.pathname = `/api/${pathName}`;

    url.search = qs.stringify({
        fields: ['Begin', 'End', 'publishedAt'],
        sort: ['Begin'],
        populate: {
            [artistFieldName]: { populate: ['Images', 'Links'] },
            location: { populate: 'Images' },
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

export default createFullTimeProgramItemFetchUrl;
