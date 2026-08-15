// IMAP CLI for the live no-reply mailbox (MAIL_* from .env).
//
// MAIL_PORT in .env is SMTP (465). IMAP always uses IMAP_PORT or 993.
//
// What each command does:
//   folders         — list mailboxes (INBOX, Sent, …)
//   list            — newest messages in a folder (headers only)
//   search          — filter by subject / from / since (headers only)
//   survey          — classify whole INBOX: bounce / reply / zusage / other
//   read            — print one message body by uid
//   create-folder   — create a mailbox path
//   move            — move one message by uid into another folder
//   seen            — set \\Seen on one or more uids
//
// Examples:
//   npm run imap-mail -- folders
//   npm run imap-mail -- list --limit 20
//   npm run imap-mail -- list --unseen
//   npm run imap-mail -- search --subject Zusage --limit 40
//   npm run imap-mail -- search --since 2026-07-01
//   npm run imap-mail -- survey --since 2026-01-01
//   npm run imap-mail -- read 887
//   npm run imap-mail -- create-folder Absagen
//   npm run imap-mail -- move 887 Absagen
//   npm run imap-mail -- seen 79 82 84 89 --folder 'INBOX/Festival 2026/Rückmeldungen Zusagen'

import 'dotenv/config';
import { ImapFlow, type SearchObject } from 'imapflow';

const DEFAULT_FOLDER = 'INBOX';
const DEFAULT_LIMIT = 30;

type MailCategory = 'bounce' | 'autoreply' | 'zusage-thread' | 'bewerbung-reply' | 'reply' | 'other';

type HeaderRow = {
    uid: number;
    date: string;
    from: string;
    subject: string;
    category: MailCategory;
    seen: boolean;
};

const toUidList = (uids: false | number[] | null | undefined): number[] => (Array.isArray(uids) ? uids : []);

const toIsoDate = (value: Date | string | null | undefined): string => {
    if (value === null || value === undefined) {
        return '';
    }

    return (typeof value === 'string' ? new Date(value) : value).toISOString();
};

const requireEnv = (name: string): string => {
    const value = process.env[name];
    if (!value) {
        throw new Error(`${name} is not set`);
    }
    return value;
};

const createClient = (): ImapFlow =>
    new ImapFlow({
        host: requireEnv('MAIL_HOST'),
        port: Number(process.env.IMAP_PORT ?? 993),
        secure: true,
        auth: { user: requireEnv('MAIL_USER'), pass: requireEnv('MAIL_PASSWORD') },
        logger: false,
    });

const withClient = async <T>(fn: (client: ImapFlow) => Promise<T>): Promise<T> => {
    const client = createClient();
    await client.connect();
    try {
        return await fn(client);
    } finally {
        await client.logout().catch(() => undefined);
    }
};

const printUsage = (): never => {
    console.error(`Usage:
  npm run imap-mail -- folders
  npm run imap-mail -- list [folder] [--limit N] [--unseen]
  npm run imap-mail -- search [--folder F] [--subject S] [--from F] [--since YYYY-MM-DD] [--limit N]
  npm run imap-mail -- survey [--folder F] [--since YYYY-MM-DD]
  npm run imap-mail -- read <uid> [folder]
  npm run imap-mail -- create-folder <path>
  npm run imap-mail -- move <uid> <toFolder> [fromFolder]
  npm run imap-mail -- seen <uid...> [--folder F]`);
    process.exit(1);
};

const takeFlagValue = (args: string[], flag: string): string | undefined => {
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

const hasFlag = (args: string[], flag: string): boolean => args.includes(flag);

const formatAddress = (value: unknown): string => {
    if (!value || typeof value !== 'object') {
        return '';
    }
    const addr = value as { name?: string; address?: string };
    if (addr.name && addr.address) {
        return `${addr.name} <${addr.address}>`;
    }
    return addr.address || addr.name || '';
};

const formatAddressList = (value: unknown): string => {
    if (!Array.isArray(value)) {
        return formatAddress(value);
    }
    return value.map(formatAddress).filter(Boolean).join(', ');
};

const firstFromAddress = (value: unknown): string => {
    if (!Array.isArray(value) || value.length === 0) {
        return '';
    }
    const first = value[0] as { address?: string };
    return (first.address ?? '').toLowerCase();
};

const classify = (subject: string, fromAddress: string): MailCategory => {
    const s = subject.toLowerCase();
    const f = fromAddress.toLowerCase();

    if (
        f.includes('mailer-daemon') ||
        f.includes('postmaster') ||
        s.includes('mail delivery failed') ||
        s.includes('unzustellbar') ||
        s.includes('delayed')
    ) {
        return 'bounce';
    }
    if (
        s.includes('automatische antwort') ||
        s.includes('automatic reply') ||
        s.includes('abwesenheitsnotiz') ||
        s.includes('out of office')
    ) {
        return 'autoreply';
    }
    if (s.includes('zusage')) {
        return 'zusage-thread';
    }
    if (s.includes('bewerbungsbestätigung') || s.includes('bewerbungsbestaetigung')) {
        return 'bewerbung-reply';
    }
    if (/^(re|aw|wg|fwd)\s*:/i.test(subject.trim())) {
        return 'reply';
    }
    return 'other';
};

const decodeQuotedPrintable = (input: string): string => {
    const withoutSoftBreaks = input.replace(/=\r?\n/g, '');
    const bytes: number[] = [];
    for (let i = 0; i < withoutSoftBreaks.length; i += 1) {
        if (withoutSoftBreaks[i] === '=' && /^[0-9A-Fa-f]{2}$/.test(withoutSoftBreaks.slice(i + 1, i + 3))) {
            bytes.push(parseInt(withoutSoftBreaks.slice(i + 1, i + 3), 16));
            i += 2;
            continue;
        }
        bytes.push(withoutSoftBreaks.charCodeAt(i));
    }
    return Buffer.from(bytes).toString('utf8');
};

const stripHtml = (html: string): string =>
    html
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/p>/gi, '\n')
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&auml;/g, 'ä')
        .replace(/&ouml;/g, 'ö')
        .replace(/&uuml;/g, 'ü')
        .replace(/&Auml;/g, 'Ä')
        .replace(/&Ouml;/g, 'Ö')
        .replace(/&Uuml;/g, 'Ü')
        .replace(/&szlig;/g, 'ß');

const decodePartBody = (headers: string, body: string): string => {
    if (/Content-Transfer-Encoding:\s*base64/i.test(headers)) {
        try {
            return Buffer.from(body.replace(/\s+/g, ''), 'base64').toString('utf8');
        } catch {
            return body;
        }
    }
    if (/Content-Transfer-Encoding:\s*quoted-printable/i.test(headers)) {
        return decodeQuotedPrintable(body);
    }
    return body;
};

const extractText = (source: Buffer | false | undefined): string => {
    if (!source) {
        return '';
    }
    const raw = source.toString('utf8');
    const chunks = raw.split(/\n(?=--)/);
    const plainParts: string[] = [];
    const htmlParts: string[] = [];

    for (const chunk of chunks) {
        const isPlain = /Content-Type:\s*text\/plain/i.test(chunk);
        const isHtml = /Content-Type:\s*text\/html/i.test(chunk);
        if (!isPlain && !isHtml) {
            continue;
        }
        const headerEnd = chunk.search(/\r?\n\r?\n/);
        if (headerEnd < 0) {
            continue;
        }
        const headers = chunk.slice(0, headerEnd);
        const body = decodePartBody(
            headers,
            chunk
                .slice(headerEnd)
                .replace(/^\r?\n\r?\n/, '')
                .replace(/\n--[\s\S]*$/, ''),
        );
        if (isPlain) {
            plainParts.push(body);
        } else {
            htmlParts.push(stripHtml(body));
        }
    }

    const text = (plainParts[0] ?? htmlParts[0] ?? '').replace(/\r\n/g, '\n').trim();
    if (text) {
        return text;
    }

    const headerEnd = raw.search(/\r?\n\r?\n/);
    if (headerEnd < 0) {
        return raw.slice(0, 4000);
    }
    return decodePartBody(raw.slice(0, headerEnd), raw.slice(headerEnd).replace(/^\r?\n\r?\n/, ''))
        .replace(/\r\n/g, '\n')
        .trim()
        .slice(0, 4000);
};

const summarizeReplyBody = (text: string): string => {
    const lines = text.split('\n');
    const cutAt = lines.findIndex((line) => /^(On .+wrote:|Am .+schrieb|-----Original Message-----|From:\s+\S+@)/i.test(line.trim()));
    return (cutAt > 0 ? lines.slice(0, cutAt) : lines).join('\n').trim();
};

const printHeaderRow = (row: HeaderRow): void => {
    console.log(`uid=${row.uid} | ${row.date.slice(0, 10)} | [${row.category}] | ${row.from} | ${row.subject}`);
};

const fetchHeaderRows = async (client: ImapFlow, uids: number[]): Promise<HeaderRow[]> => {
    const rows: HeaderRow[] = [];
    const chunkSize = 200;
    for (let i = 0; i < uids.length; i += chunkSize) {
        const chunk = uids.slice(i, i + chunkSize);
        for await (const message of client.fetch(chunk, { uid: true, flags: true, envelope: true, internalDate: true }, { uid: true })) {
            const subject = message.envelope?.subject ?? '(no subject)';
            const fromAddress = firstFromAddress(message.envelope?.from);
            rows.push({
                uid: message.uid!,
                date: toIsoDate(message.internalDate),
                from: formatAddressList(message.envelope?.from) || fromAddress || '?',
                subject,
                category: classify(subject, fromAddress),
                seen: message.flags?.has('\\Seen') ?? false,
            });
        }
    }
    return rows;
};

const cmdFolders = async (): Promise<void> => {
    await withClient(async (client) => {
        const folders = await client.list();
        console.log(`Folders (${folders.length}):\n`);
        for (const folder of folders) {
            const flags = folder.specialUse ? ` [${folder.specialUse}]` : '';
            console.log(`  ${folder.path}${flags}`);
        }
    });
};

const cmdList = async (args: string[]): Promise<void> => {
    const folder = args.find((arg) => !arg.startsWith('--')) ?? DEFAULT_FOLDER;
    const limit = Number(takeFlagValue(args, '--limit') ?? DEFAULT_LIMIT);
    const unseen = hasFlag(args, '--unseen');

    await withClient(async (client) => {
        const lock = await client.getMailboxLock(folder);
        try {
            const exists = client.mailbox && typeof client.mailbox !== 'boolean' ? client.mailbox.exists : 0;
            console.log(`Mailbox ${folder}: ${exists} messages (showing up to ${limit}${unseen ? ', unseen only' : ''})\n`);

            const uids = toUidList(await client.search(unseen ? { seen: false } : { all: true }, { uid: true }));
            if (uids.length === 0) {
                console.log('(no messages)');
                return;
            }

            const rows = await fetchHeaderRows(client, uids.slice(-limit));
            for (const row of rows) {
                printHeaderRow(row);
            }
        } finally {
            lock.release();
        }
    });
};

const cmdSearch = async (args: string[]): Promise<void> => {
    const folder = takeFlagValue(args, '--folder') ?? DEFAULT_FOLDER;
    const subject = takeFlagValue(args, '--subject');
    const from = takeFlagValue(args, '--from');
    const sinceRaw = takeFlagValue(args, '--since');
    const limit = Number(takeFlagValue(args, '--limit') ?? DEFAULT_LIMIT);

    if (!subject && !from && !sinceRaw) {
        throw new Error('search requires at least one of --subject, --from, --since');
    }

    const query: SearchObject = {};
    if (subject) {
        query.subject = subject;
    }
    if (from) {
        query.from = from;
    }
    if (sinceRaw) {
        const since = new Date(sinceRaw);
        if (Number.isNaN(since.getTime())) {
            throw new Error(`Invalid --since date: ${sinceRaw}`);
        }
        query.since = since;
    }

    await withClient(async (client) => {
        const lock = await client.getMailboxLock(folder);
        try {
            const uids = toUidList(await client.search(query, { uid: true }));
            console.log(`Search in ${folder}: ${uids.length} matches (showing up to ${limit})\n`);
            if (uids.length === 0) {
                return;
            }
            const rows = await fetchHeaderRows(client, uids.slice(-limit));
            for (const row of rows) {
                printHeaderRow(row);
            }
        } finally {
            lock.release();
        }
    });
};

const cmdSurvey = async (args: string[]): Promise<void> => {
    const folder = takeFlagValue(args, '--folder') ?? DEFAULT_FOLDER;
    const sinceRaw = takeFlagValue(args, '--since');

    await withClient(async (client) => {
        const lock = await client.getMailboxLock(folder);
        try {
            const query: SearchObject = sinceRaw ? { since: new Date(sinceRaw) } : { all: true };
            if (sinceRaw && Number.isNaN((query.since as Date).getTime())) {
                throw new Error(`Invalid --since date: ${sinceRaw}`);
            }

            const uids = toUidList(await client.search(query, { uid: true }));
            console.log(`Survey ${folder}: ${uids.length} messages${sinceRaw ? ` since ${sinceRaw}` : ''}\n`);
            if (uids.length === 0) {
                return;
            }

            const rows = await fetchHeaderRows(client, uids);
            const counts = new Map<MailCategory, number>();
            for (const row of rows) {
                counts.set(row.category, (counts.get(row.category) ?? 0) + 1);
            }

            console.log('=== Counts ===');
            for (const [category, count] of Array.from(counts.entries()).sort((a, b) => b[1] - a[1])) {
                console.log(`${String(count).padStart(4)}  ${category}`);
            }

            const actionable = rows
                .filter((row) => !['bounce', 'autoreply', 'other'].includes(row.category))
                .sort((a, b) => a.date.localeCompare(b.date));
            console.log(`\n=== Actionable replies (${actionable.length}) ===`);
            for (const row of actionable) {
                printHeaderRow(row);
            }

            const unseen = rows.filter((row) => !row.seen).sort((a, b) => a.date.localeCompare(b.date));
            console.log(`\n=== Unseen (${unseen.length}) ===`);
            for (const row of unseen) {
                printHeaderRow(row);
            }

            const bounces = rows.filter((row) => row.category === 'bounce').sort((a, b) => a.date.localeCompare(b.date));
            if (sinceRaw || bounces.length <= 40) {
                console.log(`\n=== Bounces (${bounces.length}) ===`);
                for (const row of bounces) {
                    printHeaderRow(row);
                }
            }
        } finally {
            lock.release();
        }
    });
};

const cmdRead = async (args: string[]): Promise<void> => {
    const uid = Number(args[0]);
    const folder = args[1] ?? DEFAULT_FOLDER;
    if (!uid || Number.isNaN(uid)) {
        throw new Error('read requires a numeric uid');
    }

    await withClient(async (client) => {
        const lock = await client.getMailboxLock(folder);
        try {
            let found = false;
            for await (const message of client.fetch(
                String(uid),
                { uid: true, flags: true, envelope: true, internalDate: true, source: true },
                { uid: true },
            )) {
                found = true;
                const env = message.envelope;
                console.log(`Folder:  ${folder}`);
                console.log(`UID:     ${message.uid}`);
                console.log(`Date:    ${toIsoDate(message.internalDate)}`);
                console.log(`From:    ${formatAddressList(env?.from)}`);
                console.log(`To:      ${formatAddressList(env?.to)}`);
                console.log(`Cc:      ${formatAddressList(env?.cc)}`);
                console.log(`Subject: ${env?.subject ?? '(no subject)'}`);
                console.log(`Flags:   ${Array.from(message.flags ?? []).join(', ')}`);
                console.log('---');
                console.log(summarizeReplyBody(extractText(message.source)) || '(empty body)');
            }
            if (!found) {
                console.error(`No message with uid=${uid} in ${folder}`);
                process.exit(1);
            }
        } finally {
            lock.release();
        }
    });
};

const cmdMove = async (args: string[]): Promise<void> => {
    const uid = Number(args[0]);
    const toFolder = args[1];
    const fromFolder = args[2] ?? DEFAULT_FOLDER;
    if (!uid || Number.isNaN(uid) || !toFolder) {
        throw new Error('move requires <uid> <toFolder> [fromFolder]');
    }

    await withClient(async (client) => {
        const lock = await client.getMailboxLock(fromFolder);
        try {
            const result = await client.messageMove(String(uid), toFolder, { uid: true });
            if (!result) {
                console.error(`Move failed for uid=${uid} ${fromFolder} → ${toFolder}`);
                process.exit(1);
            }
            console.log(`Moved uid=${uid} from ${fromFolder} → ${toFolder}`);
            if (result.uidMap) {
                for (const [fromUid, toUid] of Array.from(result.uidMap)) {
                    console.log(`  new uid in ${toFolder}: ${fromUid} → ${toUid}`);
                }
            }
        } finally {
            lock.release();
        }
    });
};

const cmdCreateFolder = async (args: string[]): Promise<void> => {
    const path = args[0];
    if (!path) {
        throw new Error('create-folder requires <path>');
    }

    await withClient(async (client) => {
        const created = await client.mailboxCreate(path);
        console.log(created.created ? `Created folder: ${created.path}` : `Folder already exists: ${created.path}`);
    });
};

const cmdSeen = async (args: string[]): Promise<void> => {
    const folder = takeFlagValue(args, '--folder') ?? DEFAULT_FOLDER;
    const folderFlagIndex = args.indexOf('--folder');
    const uidList = args
        .filter((arg, index) => {
            if (arg.startsWith('--')) {
                return false;
            }
            if (folderFlagIndex >= 0 && index === folderFlagIndex + 1) {
                return false;
            }
            return true;
        })
        .map(Number)
        .filter((uid) => uid > 0 && !Number.isNaN(uid));

    if (uidList.length === 0) {
        throw new Error('seen requires at least one numeric uid');
    }

    await withClient(async (client) => {
        const lock = await client.getMailboxLock(folder);
        try {
            await client.messageFlagsAdd(uidList, ['\\Seen'], { uid: true });
            console.log(`Marked \\Seen in ${folder}: ${uidList.join(', ')}`);
        } finally {
            lock.release();
        }
    });
};

const main = async (): Promise<void> => {
    const [command, ...args] = process.argv.slice(2);
    if (!command) {
        printUsage();
    }

    switch (command) {
        case 'folders':
            await cmdFolders();
            break;
        case 'list':
            await cmdList(args);
            break;
        case 'search':
            await cmdSearch(args);
            break;
        case 'survey':
            await cmdSurvey(args);
            break;
        case 'read':
            await cmdRead(args);
            break;
        case 'move':
            await cmdMove(args);
            break;
        case 'create-folder':
            await cmdCreateFolder(args);
            break;
        case 'seen':
            await cmdSeen(args);
            break;
        default:
            printUsage();
    }
};

main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
});
