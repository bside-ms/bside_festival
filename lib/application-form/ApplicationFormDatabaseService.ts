import type { Connection, UpsertResult } from 'mariadb';
import mariadb from 'mariadb';
import type ApplicationType from 'lib/application-form/ApplicationType';

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

    private createConnection(): Promise<Connection> {

        return mariadb.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
        });
    }
}
