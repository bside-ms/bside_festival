import type { NextApiRequest, NextApiResponse } from 'next';
import RegistrationDatabaseService from 'lib/registrations/RegistrationDatabaseService';

const handler = async (request: NextApiRequest, response: NextApiResponse): Promise<void> => {

    const { programType, programId } = request.query as { programType?: string, programId?: string };

    if (programType === undefined || programType === '' || programId === undefined || programId === '') {
        response.status(404).json({ data: null, error: 'Program type or program ID missing' });
        return;
    }

    const registrationDatabaseService = new RegistrationDatabaseService();

    try {
        const registrationsCount = await registrationDatabaseService.getRegistrationsCount(programType, programId);

        response.status(200).json({ data: registrationsCount });
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);

        response.status(200).json({ data: null, error });
    }
};

export default handler;
