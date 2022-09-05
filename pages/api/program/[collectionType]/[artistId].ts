import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import isGroupMember from 'lib/next-auth/isGroupMember';
import createFullTimeProgramItemFetchUrl from 'lib/strapi/createFullTimeProgramItemFetchUrl';
import createProgramItemFetchUrl from 'lib/strapi/createProgramItemFetchUrl';
import fetchProgramItems from 'lib/strapi/fetchProgramItems';
import fixDateTimeIssue from 'lib/strapi/fixDateTimeIssue';
import getDetailsFromProgramItem from 'lib/strapi/getDetailsFromProgramItem';
import type Concert from 'lib/strapi/typings/Concert';
import type FullTimeProgramItem from 'lib/strapi/typings/FullTimeProgramItem';
import type ProgramItem from 'lib/strapi/typings/ProgramItem';
import type StrapiErrorResponse from 'lib/strapi/typings/StrapiErrorResponse';
import type StrapiSuccessResponse from 'lib/strapi/typings/StrapiSuccessResponse';

const createFetchUrl = (collectionType: string, isInFestivalGroup: boolean): URL | null => {

    switch (collectionType) {
        case 'concert-artists':
            return createProgramItemFetchUrl('concerts', false, 'concert_artist', isInFestivalGroup);
        case 'performance-artists':
            return createProgramItemFetchUrl('performances', true, 'performance_artist', isInFestivalGroup);
        case 'reading-artists':
            return createProgramItemFetchUrl('readings', true, 'reading_artist', isInFestivalGroup);
        case 'workshop-organizers':
            return createProgramItemFetchUrl('workshops', true, 'workshop_organizer', isInFestivalGroup);
        case 'family-program-organizers':
            return createProgramItemFetchUrl('family-programs', true, 'family_program_organizer', isInFestivalGroup);
        case 'exhibition-artists':
            return createFullTimeProgramItemFetchUrl('exhibitions', 'exhibition_artist', isInFestivalGroup);
        case 'information-booth-organizers':
            return createFullTimeProgramItemFetchUrl('information-booths', 'information_booth_organizer', isInFestivalGroup);
        case 'food-organizers':
            return createFullTimeProgramItemFetchUrl('foods', 'food_organizer', isInFestivalGroup);
        default:
            return null;
    }
};

const handler = async (request: NextApiRequest, response: NextApiResponse): Promise<void> => {

    try {
        const { collectionType, artistId } = request.query as { collectionType?: string, artistId?: string };

        if (collectionType === undefined || collectionType === '' || artistId === undefined || artistId === '') {
            response.status(404).json({ data: null, error: 'Collection type or artist ID missing' });
            return;
        }

        const session = await getSession({ req: request });

        const isInFestivalGroup = isGroupMember('/kreise/festival/mitglieder', session);

        const programItemFetchUrl = createFetchUrl(collectionType, isInFestivalGroup);

        if (programItemFetchUrl === null) {
            response.status(404).json({ data: null, error: `Unexpected collection type "${collectionType}"` });
            return;
        }

        const programItemResponse = await fetchProgramItems<ProgramItem | FullTimeProgramItem>(programItemFetchUrl);

        let programItems = new Array<ProgramItem | FullTimeProgramItem>();

        let responseError: StrapiErrorResponse['error'] | null = null;

        if ('error' in programItemResponse) {
            responseError = programItemResponse.error;
        } else {
            programItems = programItemResponse.data
                .filter(programItem => {

                    const { artistId: programArtistId } = getDetailsFromProgramItem(programItem);

                    return programArtistId !== null && programArtistId === parseInt(artistId, 10);
                })
                .map(programItem => {

                    const { collectionType: programItemCollectionType } = getDetailsFromProgramItem(programItem);

                    switch (programItemCollectionType) {
                        case 'performance':
                        case 'reading':
                        case 'workshop':
                        case 'family-program':
                            return fixDateTimeIssue(programItem as Exclude<ProgramItem, Concert>);

                        default:
                            return programItem;
                    }
                });
        }

        if (responseError !== null) {

            response.status(200).json({
                data: null,
                error: responseError,
            } as StrapiErrorResponse);

        } else {

            response.status(200).json({
                data: programItems,
                meta: {
                    pagination: {
                        page: 0,
                        pageCount: 0,
                        pageSize: 0,
                        total: 0,
                    },
                },
            } as StrapiSuccessResponse<Array<ProgramItem | FullTimeProgramItem>>);
        }
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);

        response.status(200).json({ data: null, error });
    }
};

export default handler;
