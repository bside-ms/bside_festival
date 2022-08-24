import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import isGroupMember from 'lib/next-auth/isGroupMember';
import createArtistsFetchUrl from 'lib/strapi/createArtistsFetchUrl';
import fetchArtists from 'lib/strapi/fetchArtist';
import fixImageUrls from 'lib/strapi/fixImageUrls';
import type AllArtists from 'lib/strapi/typings/AllArtists';
import type ConcertArtist from 'lib/strapi/typings/ConcertArtist';
import type ExhibitionArtist from 'lib/strapi/typings/ExhibitionArtist';
import type FamilyProgramOrganizer from 'lib/strapi/typings/FamilyProgramOrganizer';
import type PerformanceArtist from 'lib/strapi/typings/PerformanceArtist';
import type ReadingArtist from 'lib/strapi/typings/ReadingArtist';
import type StrapiErrorResponse from 'lib/strapi/typings/StrapiErrorResponse';
import type StrapiSuccessResponse from 'lib/strapi/typings/StrapiSuccessResponse';
import type WorkshopOrganizer from 'lib/strapi/typings/WorkshopOrganizer';

const handler = async (request: NextApiRequest, response: NextApiResponse): Promise<void> => {

    const session = await getSession({ req: request });

    const isInFestivalGroup = isGroupMember('/kreise/festival/mitglieder', session);

    const concertArtistsUrl = createArtistsFetchUrl('concert-artists', isInFestivalGroup);
    const performanceArtistsUrl = createArtistsFetchUrl('performance-artists', isInFestivalGroup);
    const readingArtistsUrl = createArtistsFetchUrl('reading-artists', isInFestivalGroup);
    const workshopOrganizersUrl = createArtistsFetchUrl('workshop-organizers', isInFestivalGroup);
    const familyProgramsOrganizerUrl = createArtistsFetchUrl('family-program-organizers', isInFestivalGroup);
    const exhibitionArtistsUrl = createArtistsFetchUrl('exhibition-artists', isInFestivalGroup);

    try {
        const concertArtistsResponse = await fetchArtists<ConcertArtist>(concertArtistsUrl);
        const performanceArtistsResponse = await fetchArtists<PerformanceArtist>(performanceArtistsUrl);
        const readingArtistsResponse = await fetchArtists<ReadingArtist>(readingArtistsUrl);
        const workshopOrganizersResponse = await fetchArtists<WorkshopOrganizer>(workshopOrganizersUrl);
        const familyProgramOrganizersResponse = await fetchArtists<FamilyProgramOrganizer>(familyProgramsOrganizerUrl);
        const exhibitionArtistsResponse = await fetchArtists<ExhibitionArtist>(exhibitionArtistsUrl);

        const allArtistsResponseData: AllArtists = {
            concertArtists: null,
            performanceArtists: null,
            readingArtists: null,
            workshopsOrganizers: null,
            familyProgramOrganizers: null,
            exhibitionArtists: null,
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
        if ('error' in workshopOrganizersResponse) {
            responseError = workshopOrganizersResponse.error;
        } else {
            allArtistsResponseData.workshopsOrganizers = fixImageUrls(workshopOrganizersResponse).data;
        }
        if ('error' in familyProgramOrganizersResponse) {
            responseError = familyProgramOrganizersResponse.error;
        } else {
            allArtistsResponseData.familyProgramOrganizers = fixImageUrls(familyProgramOrganizersResponse).data;
        }
        if ('error' in exhibitionArtistsResponse) {
            responseError = exhibitionArtistsResponse.error;
        } else {
            allArtistsResponseData.exhibitionArtists = fixImageUrls(exhibitionArtistsResponse).data;
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
