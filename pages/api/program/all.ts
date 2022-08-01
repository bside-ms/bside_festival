import { endOfDay, isAfter, isBefore, isSameMinute, startOfDay } from 'date-fns';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import qs from 'qs';
import isGroupMember from 'lib/next-auth/isGroupMember';
import type AllProgramItems from 'lib/strapi/typings/AllProgramItems';
import type AllProgramItemsResponse from 'lib/strapi/typings/AllProgramItemsResponse';
import type Concert from 'lib/strapi/typings/Concert';
import type ErroneousProgramItem from 'lib/strapi/typings/ErroneousProgramItem';
import type Performance from 'lib/strapi/typings/Performance';
import type ProgramItem from 'lib/strapi/typings/ProgramItem';
import type Reading from 'lib/strapi/typings/Reading';
import type StrapiCollectionType from 'lib/strapi/typings/StrapiCollectionType';
import type StrapiErrorResponse from 'lib/strapi/typings/StrapiErrorResponse';
import type StrapiResponse from 'lib/strapi/typings/StrapiResponse';
import type StrapiSuccessResponse from 'lib/strapi/typings/StrapiSuccessResponse';
import type Workshop from 'lib/strapi/typings/Workshop';
import useBeginFromItem from 'lib/strapi/useBeginFromItem';
import useEndFromItem from 'lib/strapi/useEndFromItem';

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

const filterErroneousProgramItems = <T extends ProgramItem>(
    programItems: Array<T>,
    collectionType: StrapiCollectionType,
    allResponseData: AllProgramItems,
    erroneousProgramItems: Array<ErroneousProgramItem>
): Array<T> => {

    return programItems.filter(
        (programItem): boolean => {

            const itemBegin = useBeginFromItem(programItem);
            const itemEnd = useEndFromItem(programItem);

            if (isBefore(itemEnd, itemBegin)) {
                erroneousProgramItems.push({
                    collectionType,
                    programItem,
                    reason: 'Das Ende liegt vor dem Beginn',
                });

                return false;
            }

            if (programItem.attributes.location.data === null) {
                erroneousProgramItems.push({
                    collectionType,
                    programItem,
                    reason: 'Der Ort fehlt',
                });

                return false;
            }

            const doesOverlap = [
                ...(allResponseData.concerts ?? []),
                ...(allResponseData.workshops ?? []),
                ...(allResponseData.performances ?? []),
                ...(allResponseData.readings ?? []),
            ].some(
                otherProgramItem => {

                    if (otherProgramItem.id === programItem.id) {
                        return false;
                    }

                    if (programItem.attributes.location.data === null || otherProgramItem.attributes.location.data === null) {
                        return false;
                    }

                    if (programItem.attributes.location.data.id !== otherProgramItem.attributes.location.data.id) {
                        return false;
                    }

                    const otherItemBegin = useBeginFromItem(otherProgramItem);
                    const otherItemEnd = useEndFromItem(otherProgramItem);

                    if (isAfter(otherItemBegin, itemBegin) && isBefore(otherItemBegin, itemEnd)) {
                        return true;
                    }
                    if (isAfter(otherItemEnd, itemBegin) && isBefore(otherItemEnd, itemEnd)) {
                        return true;
                    }
                    if (isSameMinute(otherItemBegin, itemBegin) || isSameMinute(otherItemEnd, itemEnd)) {
                        return true;
                    }

                    return false;
                }
            );
            if (doesOverlap) {
                erroneousProgramItems.push({
                    collectionType,
                    programItem,
                    reason: 'Zeitraum überschneidet sich mit Programm-Punkt in derselben Location',
                });

                return false;
            }

            const festivalBegin = startOfDay(new Date('2022-09-16'));
            const festivalEnd = endOfDay(new Date('2022-09-18'));
            if (isBefore(itemBegin, festivalBegin) || isAfter(itemBegin, festivalEnd) || isBefore(itemEnd, festivalBegin) || isAfter(itemEnd, festivalEnd)) {
                erroneousProgramItems.push({
                    collectionType,
                    programItem,
                    reason: 'Programmpunkt liegt außerhalb des Festival-Zeitraums',
                });

                return false;

            }

            return true;
        }
    );
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

        const allProgramItems: AllProgramItems = {
            concerts: null,
            performances: null,
            readings: null,
            workshops: null,
        };

        const erroneousProgramItems = new Array<ErroneousProgramItem>();

        let responseError: StrapiErrorResponse['error'] | null = null;

        if ('error' in concertsResponse) {
            responseError = concertsResponse.error;
        } else {
            allProgramItems.concerts = concertsResponse.data;
        }
        if ('error' in performancesResponse) {
            responseError = performancesResponse.error;
        } else {
            allProgramItems.performances = performancesResponse.data;
        }
        if ('error' in readingsResponse) {
            responseError = readingsResponse.error;
        } else {
            allProgramItems.readings = readingsResponse.data;
        }
        if ('error' in workshopsResponse) {
            responseError = workshopsResponse.error;
        } else {
            allProgramItems.workshops = workshopsResponse.data;
        }

        if (allProgramItems.concerts !== null) {
            allProgramItems.concerts = filterErroneousProgramItems(allProgramItems.concerts, 'concert', allProgramItems, erroneousProgramItems);
        }
        if (allProgramItems.performances !== null) {
            allProgramItems.performances = filterErroneousProgramItems(allProgramItems.performances, 'performance', allProgramItems, erroneousProgramItems);
        }
        if (allProgramItems.readings !== null) {
            allProgramItems.readings = filterErroneousProgramItems(allProgramItems.readings, 'reading', allProgramItems, erroneousProgramItems);
        }
        if (allProgramItems.workshops !== null) {
            allProgramItems.workshops = filterErroneousProgramItems(allProgramItems.workshops, 'workshop', allProgramItems, erroneousProgramItems);
        }

        if (responseError !== null) {

            response.status(200).json({
                data: null,
                error: responseError,
            } as StrapiErrorResponse);

        } else {

            const allProgramItemsResponse: AllProgramItemsResponse = {
                allProgramItems,
                erroneousProgramItems,
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
