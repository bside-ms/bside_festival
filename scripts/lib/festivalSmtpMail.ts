import { ImapFlow } from 'imapflow';
import { createTransport, type Transporter } from 'nodemailer';
import MailComposer from 'nodemailer/lib/mail-composer';

export const FESTIVAL_MAIL_FROM = '"B-Side Festival" <festival@b-side.ms>';
export const FESTIVAL_MAIL_REPLY_TO = 'festival@b-side.ms';
export const FESTIVAL_MAIL_SENT_FOLDER = 'Sent';

export type FestivalSmtpMail = {
    to: string;
    subject: string;
    text: string;
    html?: string;
    from?: string;
    replyTo?: string;
    cc?: string;
};

export type FestivalMailTemplate = {
    subject: string;
    rawBody: string;
};

export const createInfostandAcceptanceMailTemplate = (recipient: string): FestivalMailTemplate => ({
    subject: 'Ihr seid beim B-Side Festival dabei',
    rawBody: `Hallo ${recipient},

endlich melden wir uns mit einer guten Nachricht: Wir freuen uns sehr, euch einen Infostand beim B-Side Festival zuzusagen!

Wo genau euer Stand stehen wird, können wir gerade leider noch nicht verbindlich sagen. Rund um die B-Side laufen weiterhin Bauarbeiten an der Hafenpromenade, weshalb sich die nutzbaren Flächen kurzfristig verändern können. Wir klären deshalb gerade, ob die Infostände direkt am Haus oder verteilt im Viertel ihren Platz finden.

Was feststeht: Wir möchten euch dabei haben und planen euren Stand ein. Sobald Ort, Aufbauzeiten und der weitere Ablauf stehen, bekommt ihr alle Infos von uns.

Entschuldigt die kurze Frist: Bitte gebt uns bis spätestens Freitag, den 14. August, kurz per Mail Bescheid, ob ihr verbindlich dabei sein möchtet. Ein einfaches „Zusage“ oder „Absage“ reicht uns völlig.

Wir freuen uns auf euch und darauf, gemeinsam das Viertel mit Leben, Austausch und guten Ideen zu füllen!

Liebe Grüße
Carsten
für das B-Side Festival`,
});

const requireEnv = (name: string): string => {
    const value = process.env[name];
    if (!value) {
        throw new Error(`${name} is not set`);
    }
    return value;
};

const mailAuth = () => ({ user: requireEnv('MAIL_USER'), pass: requireEnv('MAIL_PASSWORD') });

export const createFestivalSmtpTransport = (): Transporter =>
    createTransport({
        host: requireEnv('MAIL_HOST'),
        port: Number(requireEnv('MAIL_PORT')),
        secure: !['true', 'True', '1'].includes(process.env.MAIL_INSECURE ?? ''),
        auth: mailAuth(),
    });

const createImap = (): ImapFlow =>
    new ImapFlow({
        host: requireEnv('MAIL_HOST'),
        port: Number(process.env.IMAP_PORT ?? 993),
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

export const sendFestivalSmtpMail = async (mail: FestivalSmtpMail, mailer?: Transporter): Promise<void> => {
    const transport = mailer ?? createFestivalSmtpTransport();
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
