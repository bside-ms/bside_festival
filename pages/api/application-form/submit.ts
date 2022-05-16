import type { NextApiRequest, NextApiResponse } from 'next';
import ApplicationFormDatabaseService from 'lib/application-form/ApplicationFormDatabaseService';
import type ApplicationType from 'lib/application-form/ApplicationType';

interface ApplicationFormSubmitRequest {
    [dataName: string]: string;
    applicationType: ApplicationType;
}

const handler = async (request: NextApiRequest, response: NextApiResponse): Promise<void> => {

    const submitRequest = request.body as ApplicationFormSubmitRequest;

    const applicationFormDatabaseService = new ApplicationFormDatabaseService();

    const { applicationType, ...applicationData } = submitRequest;

    try {
        const successfullyCreated = await applicationFormDatabaseService.createNewApplication(
            submitRequest.applicationType,
            applicationData
        );

        response.status(200).json({ success: successfullyCreated });
    } catch (error) {
        // TODO: Error handling

        // eslint-disable-next-line no-console
        console.error(error);

        response.status(200).json({ success: false });
    }
};

export default handler;
