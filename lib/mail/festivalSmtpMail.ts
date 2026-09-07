import { FESTIVAL_MAIL_FROM, FESTIVAL_MAIL_REPLY_TO, FESTIVAL_MAIL_SENT_FOLDER } from '@/lib/mail/festivalMailAddresses';
import { ImapFlow } from 'imapflow';
import { createTransport, type Transporter } from 'nodemailer';
import MailComposer from 'nodemailer/lib/mail-composer';

export type FestivalSmtpMail = {
    to: string;
    subject: string;
    text: string;
    html?: string;
    from?: string;
    replyTo?: string;
    cc?: string;
};

const requireEnv = (name: string): string => {
    const value = process.env[name];
    if (!value) {
        throw new Error(`${name} is not set`);
    }
    return value;
};

const mailAuth = () => ({ user: requireEnv('SMTP_USER'), pass: requireEnv('SMTP_PASSWORD') });

const createFestivalSmtpTransport = (): Transporter =>
    createTransport({
        host: requireEnv('SMTP_HOST'),
        port: Number(requireEnv('SMTP_PORT')),
        secure: !['true', 'True', '1'].includes(process.env.SMTP_INSECURE ?? ''),
        auth: mailAuth(),
    });

const createImap = (): ImapFlow =>
    new ImapFlow({
        host: requireEnv('SMTP_HOST'),
        port: Number(process.env.SMTP_IMAP_PORT ?? 993),
        secure: true,
        auth: mailAuth(),
        logger: false,
    });

const buildFestivalRawMessage = async (mail: FestivalSmtpMail): Promise<Buffer> => {
    const from = mail.from ?? FESTIVAL_MAIL_FROM;
    const replyTo = mail.replyTo ?? FESTIVAL_MAIL_REPLY_TO;
    const composer = new MailComposer({
        from,
        replyTo,
        to: mail.to,
        cc: mail.cc,
        subject: mail.subject,
        text: mail.text,
        html: mail.html,
        date: new Date(),
    });
    return await new Promise<Buffer>((resolve, reject) => {
        composer.compile().build((error: Error | null, message: Buffer) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(message);
        });
    });
};

const appendFestivalMailToSent = async (raw: Buffer, folder = FESTIVAL_MAIL_SENT_FOLDER): Promise<void> => {
    const client = createImap();
    await client.connect();
    try {
        const result = await client.append(folder, raw, ['\\Seen']);
        if (!result) {
            throw new Error(`IMAP append to ${folder} returned empty result`);
        }
    } finally {
        await client.logout().catch(() => undefined);
    }
};

export const sendFestivalSmtpMail = async (mail: FestivalSmtpMail): Promise<void> => {
    const transport = createFestivalSmtpTransport();
    const from = mail.from ?? FESTIVAL_MAIL_FROM;
    const replyTo = mail.replyTo ?? FESTIVAL_MAIL_REPLY_TO;
    const raw = await buildFestivalRawMessage(mail);
    const info = await transport.sendMail({
        from,
        replyTo,
        to: mail.to,
        cc: mail.cc,
        subject: mail.subject,
        text: mail.text,
        html: mail.html,
    });
    if (info.accepted.length === 0) {
        throw new Error('Accepted list is empty');
    }
    await appendFestivalMailToSent(raw);
};
