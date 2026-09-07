export type MailMergeDraft = {
    body: string;
    listSearch: string;
    participantIds: Array<number>;
    subject: string;
};

const STORAGE_KEY = 'intern-mail-merge-draft';

const emptyDraft = (): MailMergeDraft => ({ body: '', listSearch: '', participantIds: [], subject: '' });

export const readMailMergeDraft = (): MailMergeDraft => {
    if (typeof window === 'undefined') {
        return emptyDraft();
    }

    const raw = sessionStorage.getItem(STORAGE_KEY);

    if (raw === null) {
        return emptyDraft();
    }

    try {
        const parsed = JSON.parse(raw) as Partial<MailMergeDraft>;
        const participantIds = Array.isArray(parsed.participantIds)
            ? parsed.participantIds.filter((id): id is number => Number.isInteger(id) && id > 0)
            : [];

        return {
            body: typeof parsed.body === 'string' ? parsed.body : '',
            listSearch: typeof parsed.listSearch === 'string' ? parsed.listSearch : '',
            participantIds,
            subject: typeof parsed.subject === 'string' ? parsed.subject : '',
        };
    } catch {
        return emptyDraft();
    }
};

const writeMailMergeDraft = (draft: MailMergeDraft): void => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
};

export const patchMailMergeDraft = (patch: Partial<MailMergeDraft>): MailMergeDraft => {
    const next = { ...readMailMergeDraft(), ...patch };
    writeMailMergeDraft(next);

    return next;
};

export const clearMailMergeDraft = (): void => {
    sessionStorage.removeItem(STORAGE_KEY);
};
