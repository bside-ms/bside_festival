import { addHours } from 'date-fns';
import dedent from 'dedent';
import type { Transporter } from 'nodemailer';
import { createTransport } from 'nodemailer';
import type { Options } from 'nodemailer/lib/mailer';
import formatDate from 'lib/common/formatDate';
import type RegistrationAddRequest from 'lib/registrations/RegistrationAddRequest';
import getDetailsFromProgramItem from 'lib/strapi/getDetailsFromProgramItem';

export default class RegistrationMailService {

    public sendRegistrationConfirmationMessage(registration: RegistrationAddRequest, hash: string): void {

        const transporter = this.createMailTransport();

        transporter.sendMail(
            this.getMailOptions(registration, hash),
            error => {
                if (error !== null) {
                    // eslint-disable-next-line no-console
                    console.error(`Failed to send mail, error: ${error.message}`);
                }
            }
        );
    }

    private createMailTransport(): Transporter {

        const transport = createTransport({
            host: process.env.MAIL_HOST,
            port: 465,
            secure: true,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD,
            },
            from: {
                name: 'B-Side Festival',
                address: 'no-reply@b-side.ms',
            },
            replyTo: 'festival@b-side.ms',
        });

        transport.verify(error => {
            if (error !== null) {
                // eslint-disable-next-line no-console
                console.error(`Failed to create mail transport, error: ${error.message}`);
            }
        });

        return transport;
    }

    private getMailOptions(registration: RegistrationAddRequest, hash: string): Options {

        return {
            to: registration.mailAddress,
            from: {
                name: 'B-Side Festival',
                address: 'no-reply@b-side.ms',
            },
            subject: this.getSubject(registration),
            text: this.getTextContent(registration, hash),
        };
    }

    private getTextContent(registration: RegistrationAddRequest, hash: string): string {

        return dedent`Hallo ${registration.fullName},
        
        hiermit bestätigen wir dir die Anmeldung zu folgendem Programmpunkt:
        ${this.getArtistName(registration) ?? ''}
        ${this.getProgramDateInfo(registration)}
        ${this.getLocationName(registration) ?? ''}
        
        Solltest du unerwartet verhindert sein, nutze bitte den folgenden Link, um deinen Platz wieder freizugeben:
        ${this.getUnregisterLink(hash)}
        
        --
        Für den B-Side Kultur e.V.
        Am Hawerkamp 29
        48155 Münster
        www.b-side.ms
        
        
        Diese E-Mail wurde automatisch erzeugt, antworte daher bitte nicht direkt auf sie, sondern nutze festival@b-side.ms.`;
    }

    private getSubject(registration: RegistrationAddRequest): string {

        const artistName = this.getArtistName(registration);

        if (artistName === null) {
            return 'Deine Anmeldung';
        }

        return `Deine Anmeldung für ${artistName}`;
    }

    private getArtistName(registration: RegistrationAddRequest): string | null {

        return getDetailsFromProgramItem(registration.programItem).artistName;
    }

    private getProgramDateInfo({ programItem }: RegistrationAddRequest): string {

        // You guessed right, need to fix time zone difference again..
        const begin = addHours(new Date(programItem.attributes.Begin), 2);
        const end = addHours(new Date(programItem.attributes.End), 2);

        const formattedDate = formatDate(begin, 'dd.MM.yyyy');
        const formattedBegin = formatDate(begin, 'HH:mm');
        const formattedEnd = formatDate(end, 'HH:mm');

        return `${formattedDate}, ${formattedBegin} - ${formattedEnd}`;
    }

    private getLocationName(registration: RegistrationAddRequest): string | null {

        const { groupOfLocation, programItem } = registration;

        return (
            groupOfLocation?.attributes.Name ??
            programItem.attributes.location.data?.attributes.Name ??
            null
        );
    }

    private getUnregisterLink(hash: string): string {

        return `https://festival.b-side.ms/programm/abmelden/${hash}`;
    }
}
