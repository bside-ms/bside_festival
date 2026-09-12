'use server';

import { requireDataPrivacyUser } from '@/lib/actions/actionAuth';
import prismaClient from '@/lib/common/prismaClient';
import { applicationActionMeta, loggedAction } from '@/lib/errorLog/loggedAction';
import { FESTIVAL_MAIL_FROM } from '@/lib/mail/festivalMailAddresses';
import { sendFestivalSmtpMail } from '@/lib/mail/festivalSmtpMail';
import { renderMailMergeHtml } from '@/lib/mailMerge/renderHtml';
import { toFestivalSmtpAttachments } from '@/lib/mailMerge/toFestivalSmtpAttachments';
import { toMailMergeVariableValues } from '@/lib/mailMerge/toRecipient';
import { isMailMergeReadyToSend, validateMailMergeTemplates } from '@/lib/mailMerge/validate';
import { interpolateMailMergeTemplate, type MailMergeVariableValues } from '@/lib/mailMerge/variables';
import { ScheduleEntryKind, type ScheduleEntryTimeMode, type Type } from '@prisma/client';
import { uniq } from 'lodash';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const mailMergeMailSchema = z.object({
    bodyTemplate: z.string().trim().min(1),
    participantId: z.number().int().positive(),
    subjectTemplate: z.string().trim().min(1),
});

const mailMergeRecipientIdsSchema = z.array(z.number().int().positive()).min(1).max(1000);

type ParticipantMailRow = {
    contactMail: string;
    contactName: string | null;
    feeEuros: number | null;
    id: number;
    name: string;
    scheduleEntries: Array<{
        endsAt: Date | null;
        programLocation: { name: string };
        startsAt: Date | null;
        timeMode: ScheduleEntryTimeMode;
    }>;
    type: Type;
};

const scheduleEntrySelect = {
    endsAt: true,
    programLocation: { select: { name: true } },
    startsAt: true,
    timeMode: true,
} as const;

const participantMailSelect = {
    contactMail: true,
    contactName: true,
    feeEuros: true,
    id: true,
    name: true,
    scheduleEntries: {
        orderBy: { startsAt: 'asc' as const },
        select: scheduleEntrySelect,
        where: { kind: ScheduleEntryKind.Participant },
    },
    type: true,
} as const;

export type MailMergeRecipient = {
    contactMail: string;
    id: number;
    name: string;
    values: MailMergeVariableValues;
};

const toRecipient = (participant: ParticipantMailRow): MailMergeRecipient => ({
    contactMail: participant.contactMail.trim(),
    id: participant.id,
    name: participant.name,
    values: toMailMergeVariableValues({
        contactName: participant.contactName,
        feeEuros: participant.feeEuros,
        name: participant.name,
        slots: participant.scheduleEntries.map((entry) => ({
            endsAt: entry.endsAt,
            locationName: entry.programLocation.name,
            startsAt: entry.startsAt,
            timeMode: entry.timeMode,
        })),
        type: participant.type,
    }),
});

const describeValidationFailure = (subject: string, body: string, recipient: MailMergeRecipient): string => {
    const validation = validateMailMergeTemplates(subject, body, [recipient]);

    if (validation.unknownVariables.length > 0) {
        return `Unbekannte Variable: ${validation.unknownVariables.join(', ')}`;
    }

    const issue = validation.issues[0];

    if (issue === undefined) {
        return 'Mail konnte nicht vorbereitet werden.';
    }

    const parts: Array<string> = [];

    if (issue.missingMail) {
        parts.push('keine gültige E-Mail-Adresse');
    }

    if (issue.missingVariables.length > 0) {
        parts.push(`leere Variable: ${issue.missingVariables.join(', ')}`);
    }

    return parts.join('; ');
};

const revalidateMailMergePaths = (): void => {
    revalidatePath('/intern', 'layout');
};

export const getMailMergeRecipients = loggedAction(
    'getMailMergeRecipients',
    async (participantIds: Array<number>): Promise<Array<MailMergeRecipient>> => {
        await requireDataPrivacyUser();
        const ids = uniq(mailMergeRecipientIdsSchema.parse(participantIds));
        const participants = await prismaClient.participant.findMany({
            select: participantMailSelect,
            where: { id: { in: ids } },
        });
        const byId = new Map(participants.map((participant) => [participant.id, participant]));

        return ids.flatMap((id) => {
            const participant = byId.get(id);

            return participant === undefined ? [] : [toRecipient(participant)];
        });
    },
    (participantIds) => ({ context: { count: participantIds.length }, targetType: 'Application' }),
);

export const sendMailMergeMail = loggedAction(
    'sendMailMergeMail',
    async (participantId: number, subjectTemplate: string, bodyTemplate: string, attachments: Array<File> = []): Promise<void> => {
        const actor = await requireDataPrivacyUser();
        const parsed = mailMergeMailSchema.parse({ bodyTemplate, participantId, subjectTemplate });
        const participant = await prismaClient.participant.findUnique({
            select: participantMailSelect,
            where: { id: parsed.participantId },
        });

        if (participant === null) {
            throw new Error('Programmbeitrag nicht gefunden.');
        }

        const recipient = toRecipient(participant);
        const validation = validateMailMergeTemplates(parsed.subjectTemplate, parsed.bodyTemplate, [recipient]);

        if (!isMailMergeReadyToSend(parsed.subjectTemplate, parsed.bodyTemplate, validation)) {
            throw new Error(describeValidationFailure(parsed.subjectTemplate, parsed.bodyTemplate, recipient));
        }

        const festivalAttachments = await toFestivalSmtpAttachments(attachments);
        const subject = interpolateMailMergeTemplate(parsed.subjectTemplate, recipient.values, true);
        const text = interpolateMailMergeTemplate(parsed.bodyTemplate, recipient.values);

        await sendFestivalSmtpMail({
            attachments: festivalAttachments.length > 0 ? festivalAttachments : undefined,
            from: FESTIVAL_MAIL_FROM,
            html: renderMailMergeHtml(text),
            subject,
            text,
            to: recipient.contactMail,
        });

        await prismaClient.comment.create({
            data: {
                authorName: actor.name ?? actor.email ?? 'Unbekannt',
                authorUserId: actor.email ?? actor.name ?? 'unknown-user',
                participantId: participant.id,
                text: `Mail: »${subject}«`,
            },
        });
        revalidateMailMergePaths();
    },
    (participantId, subjectTemplate) => applicationActionMeta(participantId, { subjectTemplate }),
);
