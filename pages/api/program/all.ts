import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import qs from 'qs';
import isGroupMember from 'lib/next-auth/isGroupMember';
import type AllProgramItems from 'lib/strapi/typings/AllProgramItems';
import type Concert from 'lib/strapi/typings/Concert';
import type Performance from 'lib/strapi/typings/Performance';
import type Reading from 'lib/strapi/typings/Reading';
import type StrapiErrorResponse from 'lib/strapi/typings/StrapiErrorResponse';
import type StrapiResponse from 'lib/strapi/typings/StrapiResponse';
import type StrapiSuccessResponse from 'lib/strapi/typings/StrapiSuccessResponse';
import type Workshop from 'lib/strapi/typings/Workshop';

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
        populate: [artistFieldName, 'location'],
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

const fetchProgramItems = async <T>(fetchUrl: URL): Promise<StrapiResponse<Array<T>>> => {

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

const handler = async (request: NextApiRequest, response: NextApiResponse): Promise<void> => {

    const session = await getSession({ req: request });

    const isInFestivalGroup = isGroupMember('/kreise/festival/mitglieder', session);

    const concertUrl = createProgramItemFetchUrl('concerts', false, 'concert_artist', isInFestivalGroup);
    const performanceUrl = createProgramItemFetchUrl('performances', true, 'performance_artist', isInFestivalGroup);
    const readingUrl = createProgramItemFetchUrl('readings', true, 'reading_artist', isInFestivalGroup);
    const workshopUrl = createProgramItemFetchUrl('workshops', true, 'workshop_organizer', isInFestivalGroup);

    try {

        const concertsResponse = await fetchProgramItems<Concert>(concertUrl);
        const performancesResponse = await fetchProgramItems<Performance>(performanceUrl);
        const readingsResponse = await fetchProgramItems<Reading>(readingUrl);
        const workshopsResponse = await fetchProgramItems<Workshop>(workshopUrl);

        const allResponseData: AllProgramItems = {
            concerts: null,
            performances: null,
            readings: null,
            workshops: null,
        };

        let responseError: StrapiErrorResponse['error'] | null = null;

        if ('error' in concertsResponse) {
            responseError = concertsResponse.error;
        } else {
            allResponseData.concerts = concertsResponse.data;
        }
        if ('error' in performancesResponse) {
            responseError = performancesResponse.error;
        } else {
            allResponseData.performances = performancesResponse.data;
        }
        if ('error' in readingsResponse) {
            responseError = readingsResponse.error;
        } else {
            allResponseData.readings = readingsResponse.data;
        }
        if ('error' in workshopsResponse) {
            responseError = workshopsResponse.error;
        } else {
            allResponseData.workshops = workshopsResponse.data;
        }

        if (responseError !== null) {

            response.status(200).json({
                data: null,
                error: responseError,
            } as StrapiErrorResponse);

        } else {

            response.status(200).json({
                data: allResponseData,
                meta: {
                    pagination: {
                        page: 0,
                        pageCount: 0,
                        pageSize: 0,
                        total: 0,
                    },
                },
            } as StrapiSuccessResponse<AllProgramItems>);
        }
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);

        response.status(200).json({ data: null, error });
    }
};

export default handler;
