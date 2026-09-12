import bytes from 'bytes';
import { has, last, sumBy } from 'lodash';

export const MAIL_MERGE_ATTACHMENT_MAX_COUNT = 3;
const MAIL_MERGE_ATTACHMENT_MAX_TOTAL_BYTES = bytes('10MB')!;

const mailMergeAttachmentContentTypes = ['application/pdf', 'image/jpeg', 'image/png'] as const;

export const mailMergeAttachmentAccept = '.pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png';

const contentTypeByExtension: Record<string, (typeof mailMergeAttachmentContentTypes)[number]> = {
    jpeg: 'image/jpeg',
    jpg: 'image/jpeg',
    pdf: 'application/pdf',
    png: 'image/png',
};

type MailMergeAttachmentFile = {
    lastModified?: number;
    name: string;
    size: number;
    type: string;
};

const normalizeMailMergeAttachmentContentType = (type: string): (typeof mailMergeAttachmentContentTypes)[number] | null => {
    const lowered = type.toLowerCase();

    if (lowered === 'image/jpg') {
        return 'image/jpeg';
    }

    return mailMergeAttachmentContentTypes.find((allowed) => allowed === lowered) ?? null;
};

const extensionOfFilename = (name: string): string => last(name.toLowerCase().split('.')) ?? '';

const isAllowedMailMergeAttachment = (file: MailMergeAttachmentFile): boolean =>
    normalizeMailMergeAttachmentContentType(file.type) !== null || has(contentTypeByExtension, extensionOfFilename(file.name));

export const mailMergeAttachmentKey = (file: MailMergeAttachmentFile): string => `${file.name}:${file.size}:${file.lastModified ?? 0}`;

export const formatMailMergeAttachmentSize = (size: number): string =>
    bytes.format(size, { decimalPlaces: 1, unitSeparator: '\u00a0' }) ?? `${size}\u00a0B`;

export const validateMailMergeAttachments = (files: Array<MailMergeAttachmentFile>): string | null => {
    if (files.length > MAIL_MERGE_ATTACHMENT_MAX_COUNT) {
        return 'Maximal 3 Dateien.';
    }

    if (files.some((file) => file.size <= 0)) {
        return 'Leere Datei ist nicht erlaubt.';
    }

    if (files.some((file) => !isAllowedMailMergeAttachment(file))) {
        return 'Nur PDF, JPEG und PNG.';
    }

    if (sumBy(files, 'size') > MAIL_MERGE_ATTACHMENT_MAX_TOTAL_BYTES) {
        return 'Zusammen höchstens 10 MB.';
    }

    return null;
};
