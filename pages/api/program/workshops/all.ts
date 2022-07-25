import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import qs from 'qs';
import useIsGroupMember from 'lib/next-auth/useIsGroupMember';
import type StrapiResponse from 'lib/strapi/StrapiResponse';
import type Workshop from 'lib/strapi/Workshop';

const handler = async (request: NextApiRequest, response: NextApiResponse): Promise<void> => {

    const session = await getSession({ req: request });

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const isInFestivalGroup = useIsGroupMember('/kreise/festival/mitglieder', session);

    const url = new URL(process.env.STRAPI_BASE_URL!);

    url.pathname = '/api/workshops';
    url.search = qs.stringify({
        fields: ['Date', 'Begin', 'End', 'publishedAt'],
        sort: ['Date', 'Begin'],
        populate: ['workshop_organizer', 'location'],
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

        const strapiResponse = await fetchResponse.json() as StrapiResponse<Array<Workshop>>;

        response.status(200).json(strapiResponse);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);

        response.status(200).json({ data: null, error });
    }
};

export default handler;
