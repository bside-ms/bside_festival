import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import isGroupMember from 'lib/next-auth/isGroupMember';
import createArtistFetchUrl from 'lib/strapi/createArtistFetchUrl';
import fetchArtists from 'lib/strapi/fetchArtist';
import type Artist from 'lib/strapi/typings/Artist';

const handler = async (request: NextApiRequest, response: NextApiResponse): Promise<void> => {

    try {
        const { collectionType, artistId } = request.query as { collectionType?: string, artistId?: string };

        if (collectionType === undefined || collectionType === '' || artistId === undefined || artistId === '') {
            response.status(404).json({ data: null, error: 'Collection type or artist ID missing' });
            return;
        }

        const session = await getSession({ req: request });

        const isInFestivalGroup = isGroupMember('/kreise/festival/mitglieder', session);

        const artistFetchUrl = createArtistFetchUrl(collectionType, artistId, isInFestivalGroup);

        const artistsResponse = await fetchArtists<Artist>(artistFetchUrl);

        if (!('error' in artistsResponse) && artistsResponse.meta.pagination.total === 0) {
            response.status(200).json({ data: null, error: 'Künstler:in nicht gefunden' });
        }

        response.status(200).json(artistsResponse);

    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);

        response.status(200).json({ data: null, error });
    }
};

export default handler;
