import type { Options } from 'nodemailer/lib/mailer';
import createMailTransport from 'lib/mail/createMailTransport';

const sendMail = (options: Options): void => {

    const transporter = createMailTransport();

    transporter.sendMail(
        options,
        error => {
            if (error !== null) {
                // eslint-disable-next-line no-console
                console.error(`Failed to send mail, error: ${error.message}`);
            }
        }
    );
};

export default sendMail;
