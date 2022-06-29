import { isAfter, isBefore } from 'date-fns';
import type { NextApiRequest, NextApiResponse } from 'next';
import ApplicationFormDatabaseService from 'lib/application-form/ApplicationFormDatabaseService';
import ApplicationType from 'lib/application-form/ApplicationType';
import RedmineTicketsService from 'lib/redmine/RedmineTicketsService';

/**
 * This "script" is just some lazy way to send a batch of applications
 * to Redmine. The applications are chosen by date.
 */

const applicationsStartDate = new Date('2022-05-20T00:20');
const applicationsEndDate = new Date('2022-06-29T13:20');

const applicationTypeToProjectsMap = new Map<ApplicationType, string>([
    [ApplicationType.konzert, 'konzert-bewerbungen'],
    [ApplicationType.anderes, 'sonstiges-bewerbungen'],
    [ApplicationType.lesung, 'lesungs-bewerbungen'],
    [ApplicationType.essensstand, 'essenstand-bewerbungen'],
    [ApplicationType.ausstellung, 'ausstellungs-bewerbungen'],
    [ApplicationType.familienprogramm, 'konzert-bewerbungen'],
    [ApplicationType.nachbarschaft, 'konzert-bewerbungen'],
    [ApplicationType.performance, 'konzert-bewerbungen'],
    [ApplicationType.workshop, 'konzert-bewerbungen'],
]);

const handler = async (_request: NextApiRequest, response: NextApiResponse): Promise<void> => {

    try {
        const applicationFormDatabaseService = new ApplicationFormDatabaseService();

        const applications = await applicationFormDatabaseService.getAllApplications(null);

        const redmineTicketsService = new RedmineTicketsService();

        applications
            .filter(application => {
                const creationDate = new Date(application.createdAt);

                return isAfter(creationDate, applicationsStartDate) && isBefore(creationDate, applicationsEndDate);
            })
            .forEach(application => {

                const projectName = applicationTypeToProjectsMap.get(application.type)!;
                const issueName = application.data.name!.slice(0, 100).replace(/(\n|\r\n)/, ' ');
                const issueDescription = `https://festival.b-side.ms/bewerbung/${application.id}`;

                /* eslint-disable no-console */
                console.log('Creating issue in Redmine with following params:');
                console.log('- projectName', projectName);
                console.log('- issueName', issueName);
                console.log('- issueDescription', issueDescription);
                /* eslint-enable no-console */

                redmineTicketsService.createIssue(projectName, issueName, issueDescription);
            });

        response.status(200).json({ success: true });
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);

        response.status(200).json({ success: false });
    }
};

export default handler;

