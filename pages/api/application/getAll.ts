import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import ApplicationFormDatabaseService from 'lib/application-form/ApplicationFormDatabaseService';

const handler = async (request: NextApiRequest, response: NextApiResponse): Promise<void> => {

    const session = await getSession({ req: request });

    const applicationFormDatabaseService = new ApplicationFormDatabaseService();

    try {
        const applications = await applicationFormDatabaseService.getAllApplications(session);

        response.status(200).json({ success: true, applications });
    } catch (error) {
        // TODO: Error handling

        // eslint-disable-next-line no-console
        console.error(error);

        response.status(200).json({ success: false, applications: [] });
    }
};

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb',
        },
    },
};

export default handler;
