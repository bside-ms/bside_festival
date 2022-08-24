import type StrapiResponse from 'lib/strapi/typings/StrapiResponse';

const fetchArtists = async <T>(fetchUrl: URL): Promise<StrapiResponse<Array<T>>> => {

    const fetchResponse = await fetch(
        fetchUrl.toString(),
        {
            headers: new Headers({
                Authorization: `Bearer ${process.env.STRAPI_API_TOKEN!}`,
            }),
        }
    );

    return await fetchResponse.json() as StrapiResponse<Array<T>>;
};

export default fetchArtists;
