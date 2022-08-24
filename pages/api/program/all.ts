import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import qs from 'qs';
import isGroupMember from 'lib/next-auth/isGroupMember';
import type AllProgramItems from 'lib/strapi/typings/AllProgramItems';
import type AllProgramItemsResponse from 'lib/strapi/typings/AllProgramItemsResponse';
import type Concert from 'lib/strapi/typings/Concert';
import type FamilyProgram from 'lib/strapi/typings/FamilyProgram';
import type Performance from 'lib/strapi/typings/Performance';
import type ProgramItem from 'lib/strapi/typings/ProgramItem';
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
        populate: {
            [artistFieldName]: { populate: 'Images' },
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

const fixDateTimeIssue = <T extends Exclude<ProgramItem, Concert>>(programItem: T): T => {

    if (!('Date' in programItem.attributes)) {
        return programItem;
    }

    const beginHourMatch = /^(\d{1,2}):/.exec(programItem.attributes.Begin);
    const endHourMatch = /^(\d{1,2}):/.exec(programItem.attributes.End);

    if (beginHourMatch === null || endHourMatch === null) {
        return programItem;
    }

    let newBeginHour = parseInt(beginHourMatch[1]!, 10);
    newBeginHour = newBeginHour - 2;
    if (newBeginHour < 0) {
        newBeginHour = 24 + newBeginHour;
    }

    let newEndHour = parseInt(endHourMatch[1]!, 10);
    newEndHour = newEndHour - 2;
    if (newEndHour < 0) {
        newEndHour = 24 + newEndHour;
    }

    programItem.attributes.Begin = `${programItem.attributes.Date}T${newBeginHour}${programItem.attributes.Begin.slice(2)}Z`;
    programItem.attributes.End = `${programItem.attributes.Date}T${newEndHour}${programItem.attributes.End.slice(2)}Z`;
    programItem.attributes.Date = '';

    return programItem;
};

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
