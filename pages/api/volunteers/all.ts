import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import VolunteersDatabaseService from 'lib/volunteers/VolunteersDatabaseService';

const handler = async (request: NextApiRequest, response: NextApiResponse): Promise<void> => {

    const session = await getSession({ req: request });

    const volunteersDatabaseService = new VolunteersDatabaseService();

    try {
        const volunteers = await volunteersDatabaseService.getAllVolunteers(session);

        response.status(200).json({ success: true, volunteers });
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);

        response.status(200).json({ success: false, volunteers: [] });
    }
};

export default handler;
