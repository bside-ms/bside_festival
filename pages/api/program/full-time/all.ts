import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import isGroupMember from 'lib/next-auth/isGroupMember';
import createFullTimeProgramItemFetchUrl from 'lib/strapi/createFullTimeProgramItemFetchUrl';
import fetchProgramItems from 'lib/strapi/fetchProgramItems';
import type AllFullTimeProgramItems from 'lib/strapi/typings/AllFullTimeProgramItems';
import type AllFullTimeProgramItemsResponse from 'lib/strapi/typings/AllFullTimeProgramItemsResponse';
import type Exhibition from 'lib/strapi/typings/Exhibition';
import type Food from 'lib/strapi/typings/Food';
import type InformationBooth from 'lib/strapi/typings/InformationBooth';
import type StrapiErrorResponse from 'lib/strapi/typings/StrapiErrorResponse';
import type StrapiSuccessResponse from 'lib/strapi/typings/StrapiSuccessResponse';

const handler = async (request: NextApiRequest, response: NextApiResponse): Promise<void> => {

    const session = await getSession({ req: request });

    const isInFestivalGroup = isGroupMember('/kreise/festival/mitglieder', session);

    const exhibitionsUrl = createFullTimeProgramItemFetchUrl('exhibitions', 'exhibition_artist', isInFestivalGroup);
    const foodsUrl = createFullTimeProgramItemFetchUrl('foods', 'food_organizer', isInFestivalGroup);
    const informationBoothsUrl = createFullTimeProgramItemFetchUrl('information-booths', 'information_booth_organizer', isInFestivalGroup);

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
