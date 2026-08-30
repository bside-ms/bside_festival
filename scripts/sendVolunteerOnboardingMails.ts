// Send the Engelsystem onboarding mail once to selected Helfi registrations.
// This script deliberately does not persist a delivery flag. Use --list and --dry-run
// first, then pass the reviewed IDs explicitly to --send.
//
// Local:
//   task send-volunteer-onboarding-mails -- --list
//   task send-volunteer-onboarding-mails -- --dry-run --all --html-out local/helfi-onboarding-preview.html
//   task send-volunteer-onboarding-mails -- --send --all
//
// Live:
//   docker compose run --rm --entrypoint npm festival-node run send-volunteer-onboarding-mails -- --list
//   docker compose run --rm --entrypoint npm festival-node run send-volunteer-onboarding-mails -- --dry-run --all
//   docker compose run --rm --entrypoint npm festival-node run send-volunteer-onboarding-mails -- --send --all

import { createVolunteerOnboardingMail, volunteerOnboardingMailSubject } from '@/lib/mail/createVolunteerOnboardingMail';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';
import { uniq } from 'lodash';
import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createFestivalSmtpTransport, sendFestivalSmtpMail } from './lib/festivalSmtpMail';

type Command = 'list' | 'dry-run' | 'send';

type ParsedArgs = {
    all: boolean;
    command: Command;
    htmlOut?: string;
    ids: number[];
};

const usage = `Usage:
  npm run send-volunteer-onboarding-mails -- --list
  npm run send-volunteer-onboarding-mails -- --dry-run (--all | <volunteer-id[,volunteer-id...]>) [--html-out local/preview.html]
  npm run send-volunteer-onboarding-mails -- --send (--all | <volunteer-id[,volunteer-id...]>)

The mail is sent from festival@b-side.ms and copied to IMAP Sent. This script does not write a delivery status to the database.`;

const createPrisma = (): PrismaClient => {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
        throw new Error('DATABASE_URL is not set');
    }

    return new PrismaClient({ adapter: new PrismaMariaDb(databaseUrl) });
};

const parseIds = (value: string): number[] => {
    const ids = value.split(',').map((id) => Number(id));
    if (ids.length === 0 || ids.some((id) => !Number.isInteger(id) || id <= 0)) {
        throw new Error('Volunteer IDs must be positive whole numbers.');
    }

    return uniq(ids);
};

const parseArgs = (argv: string[]): ParsedArgs => {
    const args = argv.slice(2);
    if (args.includes('--help') || args.includes('-h')) {
        console.log(usage);
        process.exit(0);
    }

    const commands: Command[] = ['list', 'dry-run', 'send'];
    const command = commands.find((candidate) => args.includes(`--${candidate}`));
    if (!command || commands.filter((candidate) => args.includes(`--${candidate}`)).length !== 1) {
        throw new Error(`Choose exactly one command.\n\n${usage}`);
    }

    const htmlOutIndex = args.indexOf('--html-out');
    const htmlOut = htmlOutIndex === -1 ? undefined : args[htmlOutIndex + 1];
    if (htmlOutIndex !== -1 && (!htmlOut || htmlOut.startsWith('--'))) {
        throw new Error('--html-out requires a path.');
    }
    if (htmlOut && command !== 'dry-run') {
        throw new Error('--html-out is only available with --dry-run.');
    }

    const all = args.includes('--all');
    const idArgument = args.find((arg) => !arg.startsWith('--') && arg !== htmlOut);
    if (command === 'list') {
        if (all || idArgument) {
            throw new Error(`--list does not accept --all or volunteer IDs.\n\n${usage}`);
        }

        return { all, command, htmlOut, ids: [] };
    }
    if (all === Boolean(idArgument)) {
        throw new Error(`Provide either --all or the reviewed volunteer IDs.\n\n${usage}`);
    }

    return { all, command, htmlOut, ids: idArgument ? parseIds(idArgument) : [] };
};

const main = async (): Promise<void> => {
    const { all, command, htmlOut, ids } = parseArgs(process.argv);
    const prisma = createPrisma();

    try {
        const volunteers = await prisma.volunteer.findMany({
            where: command === 'list' || all ? undefined : { int: { in: ids } },
            orderBy: { int: 'asc' },
        });

        if (command !== 'list' && !all && volunteers.length !== ids.length) {
            const foundIds = new Set(volunteers.map((volunteer) => volunteer.int));
            const missingIds = ids.filter((id) => !foundIds.has(id));
            throw new Error(`These IDs do not belong to Helfi registrations: ${missingIds.join(', ')}`);
        }

        if (command === 'list') {
            console.log(`Helfi-Anmeldungen: ${volunteers.length}`);
            volunteers.forEach((volunteer) => console.log(`${volunteer.int}\t${volunteer.fullName}\t${volunteer.mailAddress}`));
            return;
        }

        const previewVolunteer = volunteers[0]!;
        const preview = createVolunteerOnboardingMail(previewVolunteer);

        console.log(command === 'dry-run' ? '[DRY-RUN]' : '[SEND]');
        console.log(`  from: B-Side Festival <festival@b-side.ms>`);
        console.log(`  subject: ${volunteerOnboardingMailSubject}`);
        console.log(`  recipients: ${volunteers.length}`);
        console.log(`  ids: ${volunteers.map((volunteer) => volunteer.int).join(', ')}`);

        if (command === 'dry-run') {
            console.log('----- text preview -----');
            console.log(preview.text.trim());
            console.log('------------------------');
            if (htmlOut) {
                const outputPath = resolve(htmlOut);
                await writeFile(outputPath, preview.html, 'utf8');
                console.log(`  wrote HTML preview: ${outputPath}`);
            }
            console.log('Done. No mail was sent.');
            return;
        }

        const mailer = createFestivalSmtpTransport();
        for (const volunteer of volunteers) {
            const mail = createVolunteerOnboardingMail(volunteer);
            await sendFestivalSmtpMail(
                { html: mail.html, subject: volunteerOnboardingMailSubject, text: mail.text, to: volunteer.mailAddress },
                mailer,
            );
            console.log(`[SENT] ${volunteer.int} → ${volunteer.mailAddress}`);
        }
    } finally {
        await prisma.$disconnect();
    }
};

main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
});
