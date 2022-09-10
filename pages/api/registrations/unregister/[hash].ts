import type { NextApiRequest, NextApiResponse } from 'next';
import RegistrationDatabaseService from 'lib/registrations/RegistrationDatabaseService';

const handler = async (request: NextApiRequest, response: NextApiResponse): Promise<void> => {

    const { hash } = request.query as { hash?: string };

    if (hash === undefined || hash === '') {
        // eslint-disable-next-line no-console
        console.error('Hash is missing');

        response.status(404).json({ success: false });
        return;
    }

    const registrationDatabaseService = new RegistrationDatabaseService();

    try {
        const successfullyUpdated = await registrationDatabaseService.unregisterByHash(hash);

        response.status(200).json({ data: { success: successfullyUpdated } });
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);

        response.status(200).json({ data: { success: false } });
    }
};

export default handler;
