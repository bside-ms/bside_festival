import type { Options } from 'nodemailer/lib/mailer';
import createMailTransport from 'lib/mail/createMailTransport';

const sendMail = (options: Options): void => {

    const transporter = createMailTransport();

    transporter.sendMail(
        options,
        (error, info) => {
            if (error !== null) {
                // eslint-disable-next-line no-console
                console.error(`Failed to send mail, error: ${error.message}`);
            }

            console.log('error', error);
            console.log('info', info);
        }
    );
};

export default sendMail;
