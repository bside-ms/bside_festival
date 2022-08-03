import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import qs from 'qs';
import isGroupMember from 'lib/next-auth/isGroupMember';
import type InformationBooth from 'lib/strapi/typings/InformationBooth';
import type StrapiResponse from 'lib/strapi/typings/StrapiResponse';

const handler = async (request: NextApiRequest, response: NextApiResponse): Promise<void> => {

    const session = await getSession({ req: request });

    const isInFestivalGroup = isGroupMember('/kreise/festival/mitglieder', session);

    const url = new URL(process.env.STRAPI_BASE_URL!);

    url.pathname = '/api/information-booths';
    url.search = qs.stringify({
        fields: ['Begin', 'End', 'publishedAt'],
        sort: ['Begin'],
        populate: ['information_booth_organizer', 'location'],
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

        const strapiResponse = await fetchResponse.json() as StrapiResponse<Array<InformationBooth>>;

        response.status(200).json(strapiResponse);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);

        response.status(200).json({ data: null, error });
    }
};

export default handler;
