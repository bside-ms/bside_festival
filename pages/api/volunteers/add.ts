import type { NextApiRequest, NextApiResponse } from 'next';
import type Volunteer from 'lib/volunteers/Volunteer';
import VolunteersDatabaseService from 'lib/volunteers/VolunteersDatabaseService';

const handler = async (request: NextApiRequest, response: NextApiResponse): Promise<void> => {

    const submittedVolunteer = request.body as Volunteer;

    const volunteersDatabaseService = new VolunteersDatabaseService();

    try {
        const successfullyCreated = await volunteersDatabaseService.createNewVolunteer(submittedVolunteer);

        response.status(200).json({ success: successfullyCreated });
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);

        response.status(200).json({ success: false });
    }
};

export default handler;
