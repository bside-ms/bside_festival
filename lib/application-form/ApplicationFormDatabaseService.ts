import type { Connection, UpsertResult } from 'mariadb';
import mariadb from 'mariadb';
import type ApplicationData from 'lib/application-form/ApplicationData';
import type ApplicationType from 'lib/application-form/ApplicationType';

interface ApplicationsJoinResult {
    id: number;
    type: ApplicationType;
    createdAt: Date;
    dataName: string;
    dataValue: string;
}

export default class ApplicationFormDatabaseService {

    public async createNewApplication(applicationType: ApplicationType, applicationData: Record<string, string>): Promise<boolean> {

        const connection = await this.createConnection();

        const applicationInsertResult: UpsertResult = await connection.query(
            'INSERT INTO applications (type) VALUES (?)',
            applicationType
        );

        if (applicationInsertResult.warningStatus !== 0) {
            // TODO: Error handling

            // eslint-disable-next-line no-console
            console.error(`Unable to insert into applications: ${applicationInsertResult.warningStatus}`);

            return false;
        }

        const applicationsDataInsertResults = await Promise.all(
            Object.entries(applicationData).map(
                async ([dataName, dataValue]): Promise<UpsertResult> => {

                    return connection.query(
                        'INSERT INTO applicationsData (applicationId, dataName, dataValue) VALUES (?, ?, ?)',
                        [applicationInsertResult.insertId, dataName, dataValue]
                    ) as Promise<UpsertResult>;
                }
            )
        );

        if (applicationsDataInsertResults.some(insertResult => insertResult.warningStatus !== 0)) {
            // TODO: Error handling

            // eslint-disable-next-line no-console
            console.error(`Unable to insert into applicationsData: ${applicationInsertResult.warningStatus}`);

            return false;
        }

        return true;
    }

    public async getAllApplications(): Promise<Array<ApplicationData>> {

        const connection = await this.createConnection();

        const result: Array<ApplicationsJoinResult> = await connection.query(`
            SELECT
                ap.id,
                ap.type,
                ap.createdAt,
                apD.dataName,
                apD.dataValue
            FROM
                prod_festival.applications ap
            LEFT JOIN prod_festival.applicationsData apD
                ON ap.id = apD.applicationId
            WHERE
                apD.dataName NOT IN ('photo', 'technicalRiderPdf', 'contactPerson', 'mailAddress', 'phoneNumber', 'address');
        `);

        const applicationData = new Array<ApplicationData>();

        result.forEach(({ id, type, createdAt, dataName, dataValue }) => {

            const application = applicationData.find(app => app.id === id);

            if (application === undefined) {
                applicationData.push({
                    id,
                    createdAt,
                    type,
                    data: { [dataName]: dataValue.toString() },
                });
            } else {
                application.data[dataName] = dataValue.toString();
            }
        });

        return applicationData;
    }

    public async getApplication(applicationId: string): Promise<ApplicationData | null> {

        const connection = await this.createConnection();

        const result: Array<ApplicationsJoinResult> = await connection.query(`
            SELECT
                ap.id,
                ap.type,
                ap.createdAt,
                apD.dataName,
                apD.dataValue
            FROM
                prod_festival.applications ap
            LEFT JOIN prod_festival.applicationsData apD
                ON ap.id = apD.applicationId
            WHERE
                ap.id = ?
            AND
                apD.dataName NOT IN ('contactPerson', 'mailAddress', 'phoneNumber', 'address');
        `, [applicationId]);

        let application: ApplicationData | null = null;

        result.forEach(({ id, type, createdAt, dataName, dataValue }) => {

            if (application === null) {
                application = {
                    id,
                    createdAt,
                    type,
                    data: { [dataName]: dataValue.toString() },
                };
            } else {
                application.data[dataName] = dataValue.toString();
            }
        });

        return application;
    }

    private createConnection(): Promise<Connection> {

        return mariadb.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
        });
    }
}
