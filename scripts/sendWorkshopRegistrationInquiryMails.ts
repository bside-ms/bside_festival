import 'dotenv/config';

import formatDate from '@/lib/common/helper/formatDate';
import prismaClient from '@/lib/common/prismaClient';
import { festivalMailHtml, festivalMailPlainText } from '@/scripts/lib/festivalMailHtml';
import { createFestivalSmtpTransport, sendFestivalSmtpMail } from '@/scripts/lib/festivalSmtpMail';
import { ApplicationStatus, ScheduleEntryKind, ScheduleEntryTimeMode, Type } from '@prisma/client';

type Args = { dryRun: boolean };

const usage = 'Usage: npm run send-workshop-registration-inquiry-mails -- [--dry-run]';

const parseArgs = (argv: Array<string>): Args => {
    const args = argv.slice(2);
    if (args.includes('--help') || args.includes('-h')) {
        console.log(usage);
        process.exit(0);
    }

    const unknownArgs = args.filter((arg) => arg !== '--dry-run');
    if (unknownArgs.length > 0) {
        throw new Error(`Unbekannte Option: ${unknownArgs.join(', ')}\n\n${usage}`);
    }

    return { dryRun: args.includes('--dry-run') };
};

const getGreeting = (contactName: string | null): string => (contactName?.trim() ? `Hallo ${contactName.trim()},` : 'Hallo,');

const getWorkshopSlots = (scheduleEntries: Array<{ startsAt: Date | null; programLocation: { name: string } }>): string => {
    if (scheduleEntries.length === 0) {
        return 'Der genaue Termin und Ort stehen bei uns noch nicht fest.';
    }

    return scheduleEntries
        .map(
            ({ startsAt, programLocation }) =>
                `[[slot]]\n${formatDate(startsAt!, "EEEE, dd.MM.yyyy, HH:mm 'Uhr'")}, ${programLocation.name}\n[[/slot]]`,
        )
        .join('\n\n');
};

const getMailBody = (workshop: {
    contactName: string | null;
    name: string;
    scheduleEntries: Array<{ startsAt: Date | null; programLocation: { name: string } }>;
}): string => `${getGreeting(workshop.contactName)}

für euren Workshop beim B-Side Festival möchten wir kurz mit euch abstimmen, ob eine Anmeldung mit begrenzter Teilnehmendenzahl sinnvoll ist.

Euer Workshop:
${workshop.name}

Geplanter Termin und Ort:

${getWorkshopSlots(workshop.scheduleEntries)}

Wenn ihr euch eine Anmeldung wünscht, schreibt uns bitte kurz per Mail, wie viele Menschen maximal teilnehmen können. Bei mehreren Terminen nennt uns die Zahl bitte jeweils pro Termin.

Die endgültige Teilnehmendenzahl hängt auch von der Raumgröße ab. Wir stimmen das anschließend noch einmal ab und geben euch Bescheid, wie viele Menschen tatsächlich teilnehmen können. Erst danach schalten wir die Anmeldung auf der Website frei.

Wenn Menschen bei eurem Workshop einfach kommen und gehen können, müsst ihr nichts weiter tun.

Liebe Grüße
Carsten
für das B-Side Festival`;

const main = async (): Promise<void> => {
    const { dryRun } = parseArgs(process.argv);
    const workshops = await prismaClient.participant.findMany({
        orderBy: { name: 'asc' },
        select: {
            contactMail: true,
            contactName: true,
            name: true,
            scheduleEntries: {
                orderBy: { startsAt: 'asc' },
                select: { programLocation: { select: { name: true } }, startsAt: true },
                where: { kind: ScheduleEntryKind.Participant, timeMode: ScheduleEntryTimeMode.Timed },
            },
        },
        where: { contactMail: { not: '' }, status: ApplicationStatus.Confirmed, type: Type.Workshop },
    });

    if (workshops.length === 0) {
        throw new Error('Keine bestätigten Workshops mit Kontakt-E-Mail gefunden.');
    }

    console.log(dryRun ? '[DRY-RUN]' : '[SEND]');
    console.log(`${workshops.length} Workshop-Anfragen vorbereitet.`);

    const mailer = dryRun ? undefined : createFestivalSmtpTransport();
    try {
        for (const workshop of workshops) {
            const rawBody = getMailBody(workshop);
            const subject = `B-Side Festival 2026 – Anmeldung für euren Workshop „${workshop.name}“?`;

            if (dryRun) {
                console.log(
                    `  ${workshop.name} (${workshop.scheduleEntries.length} Termin${workshop.scheduleEntries.length === 1 ? '' : 'e'})`,
                );
                continue;
            }

            await sendFestivalSmtpMail(
                {
                    html: festivalMailHtml(rawBody),
                    subject,
                    text: festivalMailPlainText(rawBody),
                    to: workshop.contactMail,
                },
                mailer,
            );
            console.log(`  gesendet: ${workshop.name}`);
        }
    } finally {
        mailer?.close();
    }

    console.log(
        dryRun
            ? 'Dry-run beendet. Es wurden keine E-Mails versendet.'
            : 'Alle Workshop-Anfragen wurden versendet und im Gesendet-Ordner abgelegt.',
    );
};

main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
});
