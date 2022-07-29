import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import qs from 'qs';
import isGroupMember from 'lib/next-auth/isGroupMember';
import fixImageUrls from 'lib/strapi/fixImageUrls';
import type ConcertArtist from 'lib/strapi/typings/ConcertArtist';
import type StrapiResponse from 'lib/strapi/typings/StrapiResponse';

const handler = async (request: NextApiRequest, response: NextApiResponse): Promise<void> => {

    const session = await getSession({ req: request });
     
    const isInFestivalGroup = isGroupMember('/kreise/festival/mitglieder', session);

    const url = new URL(process.env.STRAPI_BASE_URL!);

    url.pathname = '/api/concert-artists';
    url.search = qs.stringify({
        fields: ['Name', 'Description', 'publishedAt'],
        sort: ['Name'],
        populate: ['Images', 'Links'],
        publicationState: isInFestivalGroup ? 'preview' : 'live',
    }, {
        encodeValuesOnly: true,
    });

    try {
        const fetchResponse = await fetch(
            url.toString(),
            {
                headers: new Headers({
                    Authorization: `Bearer ${process.env.STRAPI_API_TOKEN!}`,
                }),
            }
        );

        const strapiResponse = await fetchResponse.json() as StrapiResponse<Array<ConcertArtist>>;

        response.status(200).json(fixImageUrls(strapiResponse));
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);

        response.status(200).json({ data: null, error });
    }
};

export default handler;
