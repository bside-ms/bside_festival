import qs from 'qs';

const createArtistFetchUrl = (pathName: string, artistId: string, isInFestivalGroup: boolean): URL => {

    const url = new URL(process.env.STRAPI_BASE_URL!);

    url.pathname = `/api/${pathName}`;
    url.search = qs.stringify({
        filters: {
            id: {
                $eq: artistId,
            },
        },
        fields: ['Name', 'Description', 'publishedAt'],
        sort: ['Name'],
        populate: ['Images', 'Links'],
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

export default createArtistFetchUrl;
