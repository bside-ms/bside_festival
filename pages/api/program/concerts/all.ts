import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import qs from 'qs';
import useIsGroupMember from 'lib/next-auth/useIsGroupMember';
import type Concert from 'lib/strapi/Concert';
import type StrapiResponse from 'lib/strapi/StrapiResponse';

const handler = async (request: NextApiRequest, response: NextApiResponse): Promise<void> => {

    const session = await getSession({ req: request });

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const isInFestivalGroup = useIsGroupMember('/kreise/festival/mitglieder', session);

    const url = new URL(process.env.STRAPI_BASE_URL!);

    url.pathname = '/api/concerts';
    url.search = qs.stringify({
        fields: ['Begin', 'End', 'publishedAt'],
        sort: ['Begin'],
        populate: ['concert_artist', 'location'],
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

        const strapiResponse = await fetchResponse.json() as StrapiResponse<Array<Concert>>;

        response.status(200).json(strapiResponse);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);

        response.status(200).json({ data: null, error });
    }
};

export default handler;
