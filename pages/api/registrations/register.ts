import { random, toInteger } from 'lodash';
import type { NextApiRequest, NextApiResponse } from 'next';
import type RegistrationAddRequest from 'lib/registrations/RegistrationAddRequest';
import RegistrationDatabaseService from 'lib/registrations/RegistrationDatabaseService';
import RegistrationMailService from 'lib/registrations/RegistrationMailService';

const createRandomHash = (): string => {

    const letters = 'crazylogic';

    return toInteger(Date.now() * random(1, 9))
        .toString()
        .split('')
        .map((number, index) => index % 2 === 0 ? letters[parseInt(number, 10)] : number)
        .join('');

};

const handler = async (request: NextApiRequest, response: NextApiResponse): Promise<void> => {

    const submittedRegistration = request.body as RegistrationAddRequest;

    const registrationDatabaseService = new RegistrationDatabaseService();

    try {
        const randomHash = createRandomHash();

        const successfullyCreated = await registrationDatabaseService.createNewRegistration(submittedRegistration, randomHash);

        const registrationMailService = new RegistrationMailService();

        registrationMailService.sendRegistrationConfirmationMessage(submittedRegistration, randomHash);

        response.status(200).json({ success: successfullyCreated });
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);

        response.status(200).json({ success: false });
    }
};

export default handler;
