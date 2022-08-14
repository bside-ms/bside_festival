import type { Connection, UpsertResult } from 'mariadb';
import mariadb from 'mariadb';
import type { Session } from 'next-auth';
import isGroupMember from 'lib/next-auth/isGroupMember';
import type Volunteer from 'lib/volunteers/Volunteer';

export default class VolunteersDatabaseService {

    public async createNewVolunteer(volunteer: Volunteer): Promise<boolean> {

        const connection = await this.createConnection();

        const applicationInsertResult: UpsertResult = await connection.query(
            `
            INSERT INTO
                prod_festival.volunteers (
                    fullName,
                    mailAddress,
                    phoneNumber, 
                    preferredMessengers,
                    confirmedQuestions,
                    additionalInformation
                )
            VALUES
               (?, ?, ?, ?, ?, ?)
           ;
            `,
            [
                volunteer.fullName,
                volunteer.mailAddress,
                volunteer.phoneNumber,
                volunteer.preferredMessengers,
                volunteer.confirmedQuestions,
                volunteer.additionalInformation,
            ]
        );

        if (applicationInsertResult.warningStatus !== 0) {
            // eslint-disable-next-line no-console
            console.error(`Unable to insert into volunteers: ${applicationInsertResult.warningStatus}`);

            return false;
        }

        return true;
    }

    public async getAllVolunteers(session: Session | null): Promise<Array<Volunteer>> {

        const isInFestivalGroup = isGroupMember('/kreise/festival/mitglieder', session);
        const isInDataPrivacyGroup = isGroupMember('/kreise/festival/eingeschränkt/datenschutz', session);

        if (!isInFestivalGroup) {
            throw new Error('Access denied, needs to be member of group "Festival"');
        }

        const connection = await this.createConnection();

        const volunteers: Array<Volunteer> = await connection.query(`
            SELECT
                id,
                fullName,
                mailAddress,
                phoneNumber,
                preferredMessengers,
                confirmedQuestions,
                additionalInformation,
                createdAt
            FROM
                prod_festival.volunteers;
        `);

        if (!isInDataPrivacyGroup) {
            return volunteers.map(volunteer => {
                volunteer.phoneNumber = '*****';
                volunteer.mailAddress = '*****';

                return volunteer;
            });
        }

        return volunteers;
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
