import type { Transporter } from 'nodemailer';
import { createTransport } from 'nodemailer';

let mailTransport: Transporter | null = null;

const createMailTransport = (): Transporter => {

    if (mailTransport !== null) {
        return mailTransport;
    }

    mailTransport = createTransport({
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

    mailTransport.verify(error => {
        if (error !== null) {
            // eslint-disable-next-line no-console
            console.error(`Failed to create mail transport, error: ${error.message}`);
        }
    });

    return mailTransport;
};

export default createMailTransport;
