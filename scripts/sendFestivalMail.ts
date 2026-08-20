// Send arbitrary mails via SMTP (SMTP_* from .env), then copy into IMAP Sent.
// Body stays plain text (optional [[slot]] / [[quote]] markers); HTML shell matches Zusagemail vibe.
// Does NOT touch the DB.
//
//   npm run send-festival-mail -- --dry-run --to a@b.de --subject "Betreff" --body-file ./mail.txt
//   npm run send-festival-mail -- --dry-run --html-out /tmp/preview.html --to a@b.de --subject "Betreff" --body-file ./mail.txt
//   npm run send-festival-mail -- --to a@b.de --subject "Betreff" --body-file ./mail.txt
//   npm run send-festival-mail -- --plain --to a@b.de --subject "Betreff" --body-file ./mail.txt
//   npm run send-festival-mail -- --dry-run --infostand-acceptance --to a@b.de --recipient "Clara"

import 'dotenv/config';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { festivalMailHtml, festivalMailPlainText } from './lib/festivalMailHtml';
import {
    createFestivalSmtpTransport,
    createInfostandAcceptanceMailTemplate,
    FESTIVAL_MAIL_FROM,
    FESTIVAL_MAIL_REPLY_TO,
    FESTIVAL_MAIL_SENT_FOLDER,
    sendFestivalSmtpMail,
} from './lib/festivalSmtpMail';

type ParsedArgs = {
    dryRun: boolean;
    printBody: boolean;
    printHtml: boolean;
    plainOnly: boolean;
    htmlOut?: string;
    to: string;
    subject: string;
    rawBody: string;
    cc?: string;
};

const usage = `Usage:
  npm run send-festival-mail -- [--dry-run] [--print-body] [--print-html] [--html-out path.html] [--plain]
    --to <mail> --subject <text> (--body <text> | --body-file <path>) [--cc <mail>]
  npm run send-festival-mail -- [--dry-run] --infostand-acceptance --to <mail> --recipient <name> [--cc <mail>]

Body formatting (plain text file):
  - blank line = new paragraph (Hallo … normal, kein XXL-Titel)
  - Slot-Box automatisch NUR wenn der Absatz allein eine Slot-Zeile ist:
      Samstag, 19.09.2026, 18:15–19:00 Uhr, Wohnzimmer
    (muss mit Wochentag starten; Datum mitten im Satz zählt nicht)
  - optional explizit: [[slot]]…[[/slot]] / [[quote]]…[[/quote]]

Default: multipart text + branded HTML. --plain sends text only.
--infostand-acceptance fills Hallo <recipient>, (no [Name] placeholder).`;

const takeFlagValue = (args: Array<string>, flag: string): string | undefined => {
    const index = args.indexOf(flag);
    if (index === -1) {
        return undefined;
    }
    const value = args[index + 1];
    if (!value || value.startsWith('--')) {
        throw new Error(`${flag} requires a value`);
    }
    return value;
};

const parseArgs = (argv: Array<string>): ParsedArgs => {
    const args = argv.slice(2);
    if (args.includes('--help') || args.includes('-h')) {
        console.log(usage);
        process.exit(0);
    }

    const dryRun = args.includes('--dry-run');
    const printBody = args.includes('--print-body');
    const printHtml = args.includes('--print-html');
    const plainOnly = args.includes('--plain');
    const htmlOut = takeFlagValue(args, '--html-out');
    const to = takeFlagValue(args, '--to');
    const subject = takeFlagValue(args, '--subject');
    const bodyInline = takeFlagValue(args, '--body');
    const bodyFile = takeFlagValue(args, '--body-file');
    const cc = takeFlagValue(args, '--cc');
    const recipient = takeFlagValue(args, '--recipient');
    const infostandAcceptance = args.includes('--infostand-acceptance');

    if (!to) {
        throw new Error(`Missing --to.\n\n${usage}`);
    }

    if (infostandAcceptance) {
        if (!recipient) {
            throw new Error(`--infostand-acceptance requires --recipient.\n\n${usage}`);
        }
        if (subject || bodyInline || bodyFile) {
            throw new Error(`--infostand-acceptance cannot be combined with --subject, --body, or --body-file.\n\n${usage}`);
        }

        const template = createInfostandAcceptanceMailTemplate(recipient);
        return { dryRun, printBody, printHtml, plainOnly, htmlOut, to, subject: template.subject, rawBody: template.rawBody, cc };
    }

    if (!subject) {
        throw new Error(`Missing --subject.\n\n${usage}`);
    }
    if (Boolean(bodyInline) === Boolean(bodyFile)) {
        throw new Error(`Provide exactly one of --body or --body-file.\n\n${usage}`);
    }

    const rawBody = bodyFile ? readFileSync(resolve(bodyFile), 'utf8') : (bodyInline as string);

    if (!rawBody.trim()) {
        throw new Error('Mail body is empty');
    }

    return { dryRun, printBody, printHtml, plainOnly, htmlOut, to, subject, rawBody, cc };
};

const main = async () => {
    const { dryRun, printBody, printHtml, plainOnly, htmlOut, to, subject, rawBody, cc } = parseArgs(process.argv);
    const text = festivalMailPlainText(rawBody);
    const html = plainOnly ? undefined : festivalMailHtml(rawBody);

    console.log(dryRun ? '[DRY-RUN]' : '[SEND]');
    console.log(`  from: ${FESTIVAL_MAIL_FROM}`);
    console.log(`  replyTo: ${FESTIVAL_MAIL_REPLY_TO}`);
    console.log(`  to: ${to}`);
    if (cc) {
        console.log(`  cc: ${cc}`);
    }
    console.log(`  subject: ${subject}`);
    console.log(`  format: ${html ? 'multipart text+html' : 'text only'}`);
    console.log(`  sent-copy: IMAP append → ${FESTIVAL_MAIL_SENT_FOLDER}`);
    console.log('  (no DB update)');

    if (printBody || dryRun) {
        console.log('----- text -----');
        console.log(text.replace(/\n$/, ''));
        console.log('---------------');
    }

    if (html && (printHtml || htmlOut)) {
        if (printHtml) {
            console.log('----- html -----');
            console.log(html);
            console.log('---------------');
        }
        if (htmlOut) {
            writeFileSync(resolve(htmlOut), html, 'utf8');
            console.log(`  wrote preview: ${resolve(htmlOut)}`);
        }
    }

    if (dryRun) {
        console.log('\nDone. dry-run only.');
        return;
    }

    const mailer = createFestivalSmtpTransport();
    await sendFestivalSmtpMail({ to, subject, text, html, cc }, mailer);
    console.log(`\n[SENT]       → ${to}`);
    console.log(`[SENT-COPY]  → IMAP ${FESTIVAL_MAIL_SENT_FOLDER}`);
    console.log('\nDone.');
};

main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
});
