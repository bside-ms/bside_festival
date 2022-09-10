import type { Connection, UpsertResult } from 'mariadb';
import mariadb from 'mariadb';
import type { Session } from 'next-auth';
import isGroupMember from 'lib/next-auth/isGroupMember';
import type Registration from 'lib/registrations/Registration';
import type RegistrationAddRequest from 'lib/registrations/RegistrationAddRequest';
import type RegistrationsCount from 'lib/registrations/RegistrationsCount';
import getDetailsFromProgramItem from 'lib/strapi/getDetailsFromProgramItem';

export default class RegistrationDatabaseService {

    public async createNewRegistration({ fullName, mailAddress, programItem }: RegistrationAddRequest, hash: string): Promise<boolean> {

        const connection = await this.createConnection();

        const { collectionType } = getDetailsFromProgramItem(programItem);

        const registrationInsertResult: UpsertResult = await connection.query(
            `
            INSERT INTO
                prod_festival.registrations (
                    programType,
                    programId,
                    fullName,
                    mailAddress,
                    hash
                )
            VALUES
               (?, ?, ?, ?, ?)
            ;
            `,
            [
                collectionType,
                programItem.id,
                fullName,
                mailAddress,
                hash,
            ]
        );

        if (registrationInsertResult.warningStatus !== 0) {
            // eslint-disable-next-line no-console
            console.error(`Unable to insert into registrations: ${registrationInsertResult.warningStatus}`);

            return false;
        }

        return true;
    }

    public async getAllRegistrations(session: Session | null): Promise<Array<Registration>> {

        const isInFestivalGroup = isGroupMember('/kreise/festival/mitglieder', session);
        const isInDataPrivacyGroup = isGroupMember('/kreise/festival/eingeschränkt/datenschutz', session);

        if (!isInFestivalGroup) {
            throw new Error('Access denied, needs to be member of group "Festival"');
        }

        const connection = await this.createConnection();

        const registrations: Array<Registration> = await connection.query(`
            SELECT
                id,
                programType,
                programId,
                fullName,                   
                mailAddress,
                registeredAt,
                unregisteredAt
            FROM
                prod_festival.registrations
            WHERE
                unregisteredAt IS NULL
            ;
        `);

        if (!isInDataPrivacyGroup) {
            return registrations.map(registration => {
                registration.mailAddress = '**********';

                return registration;
            });
        }

        return registrations;
    }

    public async getRegistrations(programType: string, programId: string): Promise<Array<Registration>> {

        const connection = await this.createConnection();

        const registrations: Array<Registration> = await connection.query(`
            SELECT
                id,
                programType,
                programId,
                fullName,                   
                registeredAt,
                unregisteredAt
            FROM
                prod_festival.registrations
            WHERE
                programType = ?
            AND
                programId = ?
            AND
                unregisteredAt IS NULL
            ;
        `, [programType, programId]);

        return registrations;
    }

    public async getRegistrationsCount(programType: string, programId: string): Promise<RegistrationsCount> {

        const connection = await this.createConnection();

        const registrationsCount: Array<{ count: BigInt }> = await connection.query(`
            SELECT
                COUNT(*) as 'count'
            FROM
                prod_festival.registrations
            WHERE
                programType = ?
            AND
                programId = ?
            AND
                unregisteredAt IS NULL
            ;
        `, [programType, programId]);

        if (registrationsCount[0] === undefined) {
            return { count: 0 };
        }

        return { count: parseInt(registrationsCount[0].count.toString(), 10) };
    }

    public async unregisterByHash(hash: string): Promise<boolean> {

        const connection = await this.createConnection();

        const unregisterCountResult: Array<{ count: BigInt }> = await connection.query(`
            SELECT
                COUNT(*) as 'count'
            FROM
                prod_festival.registrations
            WHERE
                hash = ?
            AND
                unregisteredAt IS NOT NULL
            ;
        `, [hash]);

        if (unregisterCountResult[0] === undefined) {
            // eslint-disable-next-line no-console
            console.error('Could not determine count of unregistered rows with same hash');

            return false;
        }

        const unregisterCount = parseInt(unregisterCountResult[0].count.toString(), 10);

        if (unregisterCount > 0) {
            // eslint-disable-next-line no-console
            console.error(`Unexpected amount of unregistered rows with hash: ${unregisterCount}`);

            // We handle this a true, since user may hit that unregister link more than once if he/she likes to.
            return true;
        }

        const registrationUpdateResult: UpsertResult = await connection.query(
            `
                UPDATE
                    prod_festival.registrations
                SET
                    unregisteredAt = CURRENT_TIMESTAMP()
                WHERE
                    hash = ?
                ;
            `,
            [hash]
        );

        if (registrationUpdateResult.warningStatus !== 0) {
            // eslint-disable-next-line no-console
            console.error(`Unable to update registration: ${registrationUpdateResult.warningStatus}`);

            return false;
        }

        if (registrationUpdateResult.affectedRows !== 1) {
            // eslint-disable-next-line no-console
            console.error(`Unexpected amount of affected rows: ${registrationUpdateResult.affectedRows}`);

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
