import isEmptyString from '@/lib/common/helper/isEmptyString';
import isNotEmptyString from '@/lib/common/helper/isNotEmptyString';
import {
    extractUsedMailMergeVariables,
    findUnknownMailMergeVariables,
    type MailMergeVariableName,
    type MailMergeVariableValues,
} from '@/lib/mailMerge/variables';
import { compact, uniq } from 'lodash';

export type MailMergeRecipientInput = {
    contactMail: string;
    id: number;
    name: string;
    values: MailMergeVariableValues;
};

export type MailMergeRecipientIssue = {
    id: number;
    name: string;
    missingVariables: Array<MailMergeVariableName>;
    missingMail: boolean;
};

export type MailMergeValidation = {
    issues: Array<MailMergeRecipientIssue>;
    unknownVariables: Array<string>;
};

const hasValidContactMail = (contactMail: string): boolean => {
    const trimmed = contactMail.trim();

    return trimmed.length > 3 && trimmed.includes('@') && !trimmed.includes(' ');
};

const collectUsedMailMergeVariables = (subject: string, body: string): Array<MailMergeVariableName> =>
    uniq([...extractUsedMailMergeVariables(subject), ...extractUsedMailMergeVariables(body)]);

export const validateMailMergeTemplates = (
    subject: string,
    body: string,
    recipients: Array<MailMergeRecipientInput>,
): MailMergeValidation => {
    const unknownVariables = uniq([...findUnknownMailMergeVariables(subject), ...findUnknownMailMergeVariables(body)]);
    const usedVariables = collectUsedMailMergeVariables(subject, body);

    const issues = compact(
        recipients.map((recipient) => {
            const missingMail = !hasValidContactMail(recipient.contactMail);
            const missingVariables = usedVariables.filter((name) => isEmptyString(recipient.values[name].trim()));

            if (!missingMail && missingVariables.length === 0) {
                return null;
            }

            return {
                id: recipient.id,
                missingMail,
                missingVariables,
                name: recipient.name,
            };
        }),
    );

    return { issues, unknownVariables };
};

export const isMailMergeReadyToSend = (subject: string, body: string, validation: MailMergeValidation): boolean =>
    isNotEmptyString(subject.trim()) &&
    isNotEmptyString(body.trim()) &&
    validation.unknownVariables.length === 0 &&
    validation.issues.length === 0;
