import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import isGroupMember from 'lib/next-auth/isGroupMember';
import createProgramItemFetchUrl from 'lib/strapi/createProgramItemFetchUrl';
import fetchProgramItems from 'lib/strapi/fetchProgramItems';
import fixDateTimeIssue from 'lib/strapi/fixDateTimeIssue';
import type AllProgramItems from 'lib/strapi/typings/AllProgramItems';
import type AllProgramItemsResponse from 'lib/strapi/typings/AllProgramItemsResponse';
import type Concert from 'lib/strapi/typings/Concert';
import type FamilyProgram from 'lib/strapi/typings/FamilyProgram';
import type Performance from 'lib/strapi/typings/Performance';
import type Reading from 'lib/strapi/typings/Reading';
import type StrapiErrorResponse from 'lib/strapi/typings/StrapiErrorResponse';
import type StrapiSuccessResponse from 'lib/strapi/typings/StrapiSuccessResponse';
import type Workshop from 'lib/strapi/typings/Workshop';

const handler = async (request: NextApiRequest, response: NextApiResponse): Promise<void> => {

    const session = await getSession({ req: request });

    const isInFestivalGroup = isGroupMember('/kreise/festival/mitglieder', session);

    const concertUrl = createProgramItemFetchUrl('concerts', false, 'concert_artist', isInFestivalGroup);
    const performanceUrl = createProgramItemFetchUrl('performances', true, 'performance_artist', isInFestivalGroup);
    const readingUrl = createProgramItemFetchUrl('readings', true, 'reading_artist', isInFestivalGroup);
    const workshopUrl = createProgramItemFetchUrl('workshops', true, 'workshop_organizer', isInFestivalGroup);
    const familyProgramUrl = createProgramItemFetchUrl('family-programs', true, 'family_program_organizer', isInFestivalGroup);

    try {

        const concertsResponse = await fetchProgramItems<Concert>(concertUrl);
        const performancesResponse = await fetchProgramItems<Performance>(performanceUrl);
        const readingsResponse = await fetchProgramItems<Reading>(readingUrl);
        const workshopsResponse = await fetchProgramItems<Workshop>(workshopUrl);
        const familyProgramResponse = await fetchProgramItems<FamilyProgram>(familyProgramUrl);

        const allProgramItems: AllProgramItems = {
            concerts: null,
            performances: null,
            readings: null,
            workshops: null,
            familyPrograms: null,
        };

        let responseError: StrapiErrorResponse['error'] | null = null;

        if ('error' in concertsResponse) {
            responseError = concertsResponse.error;
        } else {
            allProgramItems.concerts = concertsResponse.data;
        }
        if ('error' in performancesResponse) {
            responseError = performancesResponse.error;
        } else {
            allProgramItems.performances = performancesResponse.data.map(fixDateTimeIssue);
        }
        if ('error' in readingsResponse) {
            responseError = readingsResponse.error;
        } else {
            allProgramItems.readings = readingsResponse.data.map(fixDateTimeIssue);
        }
        if ('error' in workshopsResponse) {
            responseError = workshopsResponse.error;
        } else {
            allProgramItems.workshops = workshopsResponse.data.map(fixDateTimeIssue);
        }
        if ('error' in familyProgramResponse) {
            responseError = familyProgramResponse.error;
        } else {
            allProgramItems.familyPrograms = familyProgramResponse.data.map(fixDateTimeIssue);
        }

        if (responseError !== null) {

            response.status(200).json({
                data: null,
                error: responseError,
            } as StrapiErrorResponse);

        } else {

            const allProgramItemsResponse: AllProgramItemsResponse = {
                allProgramItems,
            };

            response.status(200).json({
                data: allProgramItemsResponse,
                meta: {
                    pagination: {
                        page: 0,
                        pageCount: 0,
                        pageSize: 0,
                        total: 0,
                    },
                },
            } as StrapiSuccessResponse<AllProgramItemsResponse>);
        }
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);

        response.status(200).json({ data: null, error });
    }
};

export default handler;
