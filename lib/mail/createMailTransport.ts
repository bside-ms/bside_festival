import { createTransport } from 'nodemailer';
import type Mail from 'nodemailer/lib/mailer';
import type { SentMessageInfo } from 'nodemailer/lib/smtp-transport';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

let mailTransport: Mail<SentMessageInfo> | null = null;

const createMailTransport = (): Mail<SentMessageInfo> => {
    if (mailTransport !== null) {
        return mailTransport;
    }

    const transportOptions: SMTPTransport.Options = {
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT),
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
    };

    mailTransport = createTransport(transportOptions);

    mailTransport.verify((error) => {
        if (error !== null) {
            console.error(`Failed to create mail transport, error: ${error.message}`);
        }
    });

    return mailTransport;
};

export default createMailTransport;
