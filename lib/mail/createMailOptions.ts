import type { Options } from 'nodemailer/lib/mailer';

const createMailOptions = (recipient: string, subject: string, text: string): Options => {

    return {
        to: recipient,
        subject,
        text,
    };
};

export default createMailOptions;
