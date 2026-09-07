import { formatMailMergeSlotLines, type MailMergeSlotInput } from '@/lib/mailMerge/formatSlotLines';
import type { MailMergeVariableValues } from '@/lib/mailMerge/variables';
import typeLabels from '@/lib/participants/typeLabels';
import type { Type } from '@prisma/client';

const formatMailMergeGage = (feeEuros: number | null): string => (feeEuros === null ? '' : `${feeEuros} €`);

export const toMailMergeVariableValues = (participant: {
    contactName: string | null;
    feeEuros: number | null;
    name: string;
    slots: Array<MailMergeSlotInput>;
    type: Type;
}): MailMergeVariableValues => ({
    ansprechperson: participant.contactName?.trim() ?? '',
    gage: formatMailMergeGage(participant.feeEuros),
    name: participant.name.trim(),
    termin: formatMailMergeSlotLines(participant.slots),
    typ: typeLabels[participant.type],
});
