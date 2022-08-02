import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import qs from 'qs';
import isGroupMember from 'lib/next-auth/isGroupMember';
import fixImageUrls from 'lib/strapi/fixImageUrls';
import type AllArtists from 'lib/strapi/typings/AllArtists';
import type ConcertArtist from 'lib/strapi/typings/ConcertArtist';
import type FamilyProgramOrganizer from 'lib/strapi/typings/FamilyProgramOrganizer';
import type PerformanceArtist from 'lib/strapi/typings/PerformanceArtist';
import type ReadingArtist from 'lib/strapi/typings/ReadingArtist';
import type StrapiErrorResponse from 'lib/strapi/typings/StrapiErrorResponse';
import type StrapiResponse from 'lib/strapi/typings/StrapiResponse';
import type StrapiSuccessResponse from 'lib/strapi/typings/StrapiSuccessResponse';
import type WorkshopOrganizer from 'lib/strapi/typings/WorkshopOrganizer';

const createArtistsFetchUrl = (pathName: string, isInFestivalGroup: boolean): URL => {

    const url = new URL(process.env.STRAPI_BASE_URL!);

    url.pathname = `/api/${pathName}`;
    url.search = qs.stringify({
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

const handler = async (request: NextApiRequest, response: NextApiResponse): Promise<void> => {

    const session = await getSession({ req: request });

    const isInFestivalGroup = isGroupMember('/kreise/festival/mitglieder', session);

    const concertArtistUrl = createArtistsFetchUrl('concert-artists', isInFestivalGroup);
    const performanceArtistUrl = createArtistsFetchUrl('performance-artists', isInFestivalGroup);
    const readingArtistUrl = createArtistsFetchUrl('reading-artists', isInFestivalGroup);
    const workshopOrganizerUrl = createArtistsFetchUrl('workshop-organizers', isInFestivalGroup);
    const familyProgramOrganizerUrl = createArtistsFetchUrl('family-program-organizers', isInFestivalGroup);

    try {
        const concertArtistsResponse = await fetchArtists<ConcertArtist>(concertArtistUrl);
        const performanceArtistsResponse = await fetchArtists<PerformanceArtist>(performanceArtistUrl);
        const readingArtistsResponse = await fetchArtists<ReadingArtist>(readingArtistUrl);
        const workshopOrganizerResponse = await fetchArtists<WorkshopOrganizer>(workshopOrganizerUrl);
        const familyProgramOrganizerResponse = await fetchArtists<FamilyProgramOrganizer>(familyProgramOrganizerUrl);

        const allArtistsResponseData: AllArtists = {
            concertArtists: null,
            performanceArtists: null,
            readingArtists: null,
            workshopsOrganizers: null,
            familyProgramOrganizer: null,
        };

        let responseError: StrapiErrorResponse['error'] | null = null;

        if ('error' in concertArtistsResponse) {
            responseError = concertArtistsResponse.error;
        } else {
            allArtistsResponseData.concertArtists = fixImageUrls(concertArtistsResponse).data;
        }
        if ('error' in performanceArtistsResponse) {
            responseError = performanceArtistsResponse.error;
        } else {
            allArtistsResponseData.performanceArtists = fixImageUrls(performanceArtistsResponse).data;
        }
        if ('error' in readingArtistsResponse) {
            responseError = readingArtistsResponse.error;
        } else {
            allArtistsResponseData.readingArtists = fixImageUrls(readingArtistsResponse).data;
        }
        if ('error' in workshopOrganizerResponse) {
            responseError = workshopOrganizerResponse.error;
        } else {
            allArtistsResponseData.workshopsOrganizers = fixImageUrls(workshopOrganizerResponse).data;
        }
        if ('error' in familyProgramOrganizerResponse) {
            responseError = familyProgramOrganizerResponse.error;
        } else {
            allArtistsResponseData.familyProgramOrganizer = fixImageUrls(familyProgramOrganizerResponse).data;
        }

        if (responseError !== null) {

            response.status(200).json({
                data: null,
                error: responseError,
            } as StrapiErrorResponse);

        } else {

            response.status(200).json({
                data: allArtistsResponseData,
                meta: {
                    pagination: {
                        page: 0,
                        pageCount: 0,
                        pageSize: 0,
                        total: 0,
                    },
                },
            } as StrapiSuccessResponse<AllArtists>);

        }
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);

        response.status(200).json({ data: null, error });
    }
};

export default handler;
