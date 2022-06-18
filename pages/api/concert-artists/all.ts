import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import qs from 'qs';
import useIsGroupMember from 'lib/next-auth/useIsGroupMember';

const handler = async (request: NextApiRequest, response: NextApiResponse): Promise<void> => {

    const session = await getSession({ req: request });

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const isInFestivalGroup = useIsGroupMember('/kreise/festival/mitglieder', session);

    const url = new URL(process.env.NEXT_PUBLIC_STRAPI_BASE_URL!);

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

        const jsonResponse = await fetchResponse.json();

        response.status(200).json(jsonResponse);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);

        response.status(200).json({ data: null, error });
    }
};

export default handler;
