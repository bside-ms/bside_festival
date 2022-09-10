import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import RegistrationDatabaseService from 'lib/registrations/RegistrationDatabaseService';

const handler = async (request: NextApiRequest, response: NextApiResponse): Promise<void> => {

    const session = await getSession({ req: request });

    const registrationDatabaseService = new RegistrationDatabaseService();

    try {
        const registrations = await registrationDatabaseService.getAllRegistrations(session);

        response.status(200).json({ data: registrations });
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);

        response.status(200).json({ data: null, error });
    }
};

export default handler;
