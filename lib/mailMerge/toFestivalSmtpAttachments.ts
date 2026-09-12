import type { FestivalSmtpAttachment } from '@/lib/mail/festivalSmtpMail';
import { validateMailMergeAttachments } from '@/lib/mailMerge/attachments';
import { last, map } from 'lodash';

const sanitizeFilename = (name: string): string => {
    const base = last(name.split(/[/\\]/)) ?? 'anhang';
    const cleaned = base.replace(/[\0\r\n"]/g, '_').trim();

    return cleaned.length > 0 ? cleaned : 'anhang';
};

const sniffContentType = (content: Uint8Array): FestivalSmtpAttachment['contentType'] | null => {
    if (content.length >= 4 && content[0] === 0x25 && content[1] === 0x50 && content[2] === 0x44 && content[3] === 0x46) {
        return 'application/pdf';
    }

    if (content.length >= 3 && content[0] === 0xff && content[1] === 0xd8 && content[2] === 0xff) {
        return 'image/jpeg';
    }

    if (
        content.length >= 8 &&
        content[0] === 0x89 &&
        content[1] === 0x50 &&
        content[2] === 0x4e &&
        content[3] === 0x47 &&
        content[4] === 0x0d &&
        content[5] === 0x0a &&
        content[6] === 0x1a &&
        content[7] === 0x0a
    ) {
        return 'image/png';
    }

    return null;
};

export const toFestivalSmtpAttachments = async (files: Array<File>): Promise<Array<FestivalSmtpAttachment>> => {
    const issue = validateMailMergeAttachments(files);

    if (issue !== null) {
        throw new Error(issue);
    }

    return await Promise.all(
        map(files, async (file) => {
            const content = Buffer.from(await file.arrayBuffer());
            const contentType = sniffContentType(content);

            if (contentType === null) {
                throw new Error(`Nur PDF, JPEG und PNG: ${file.name}`);
            }

            return {
                content,
                contentType,
                filename: sanitizeFilename(file.name),
            };
        }),
    );
};
