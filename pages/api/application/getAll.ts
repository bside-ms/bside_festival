import type { NextApiRequest, NextApiResponse } from 'next';
import ApplicationFormDatabaseService from 'lib/application-form/ApplicationFormDatabaseService';

const handler = async (_request: NextApiRequest, response: NextApiResponse): Promise<void> => {

    const applicationFormDatabaseService = new ApplicationFormDatabaseService();

    try {
        const applications = await applicationFormDatabaseService.getAllApplications();

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
