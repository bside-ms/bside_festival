import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import qs from 'qs';
import isGroupMember from 'lib/next-auth/isGroupMember';
import type AllFullTimeProgramItems from 'lib/strapi/typings/AllFullTimeProgramItems';
import type AllFullTimeProgramItemsResponse from 'lib/strapi/typings/AllFullTimeProgramItemsResponse';
import type Exhibition from 'lib/strapi/typings/Exhibition';
import type Food from 'lib/strapi/typings/Food';
import type InformationBooth from 'lib/strapi/typings/InformationBooth';
import type StrapiErrorResponse from 'lib/strapi/typings/StrapiErrorResponse';
import type StrapiResponse from 'lib/strapi/typings/StrapiResponse';
import type StrapiSuccessResponse from 'lib/strapi/typings/StrapiSuccessResponse';

const createProgramItemFetchUrl = (
    pathName: string,
    artistFieldName: string,
    isInFestivalGroup: boolean
): URL => {

    const url = new URL(process.env.STRAPI_BASE_URL!);

    url.pathname = `/api/${pathName}`;

    url.search = qs.stringify({
        fields: ['Begin', 'End', 'publishedAt'],
        sort: ['Begin'],
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

    const exhibitionsUrl = createProgramItemFetchUrl('exhibitions', 'exhibition_artist', isInFestivalGroup);
    const foodsUrl = createProgramItemFetchUrl('foods', 'food_organizer', isInFestivalGroup);
    const informationBoothsUrl = createProgramItemFetchUrl('information-booths', 'information_booth_organizer', isInFestivalGroup);

    try {

        const exhibitionsResponse = await fetchProgramItems<Exhibition>(exhibitionsUrl);
        const foodsResponse = await fetchProgramItems<Food>(foodsUrl);
        const informationBoothsResponse = await fetchProgramItems<InformationBooth>(informationBoothsUrl);

        const allFullTimeProgramItems: AllFullTimeProgramItems = {
            exhibitions: null,
            foods: null,
            informationBooths: null,
        };

        let responseError: StrapiErrorResponse['error'] | null = null;

        if ('error' in exhibitionsResponse) {
            responseError = exhibitionsResponse.error;
        } else {
            allFullTimeProgramItems.exhibitions = exhibitionsResponse.data;
        }
        if ('error' in foodsResponse) {
            responseError = foodsResponse.error;
        } else {
            allFullTimeProgramItems.foods = foodsResponse.data;
        }
        if ('error' in informationBoothsResponse) {
            responseError = informationBoothsResponse.error;
        } else {
            allFullTimeProgramItems.informationBooths = informationBoothsResponse.data;
        }

        if (responseError !== null) {

            response.status(200).json({
                data: null,
                error: responseError,
            } as StrapiErrorResponse);

        } else {

            const allFullTimeProgramItemsResponse: AllFullTimeProgramItemsResponse = {
                allFullTimeProgramItems,
            };

            response.status(200).json({
                data: allFullTimeProgramItemsResponse,
                meta: {
                    pagination: {
                        page: 0,
                        pageCount: 0,
                        pageSize: 0,
                        total: 0,
                    },
                },
            } as StrapiSuccessResponse<AllFullTimeProgramItemsResponse>);
        }
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);

        response.status(200).json({ data: null, error });
    }
};

export default handler;
