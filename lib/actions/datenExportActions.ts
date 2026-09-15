'use server';

import { requireDataPrivacyUser } from '@/lib/actions/actionAuth';
import prismaClient from '@/lib/common/prismaClient';
import type { DatenExportParticipant } from '@/lib/datenExport/participant';
import { loggedAction } from '@/lib/errorLog/loggedAction';
import { formatMailMergeSlotLine } from '@/lib/mailMerge/formatSlotLines';
import { ScheduleEntryKind } from '@prisma/client';
import { uniq } from 'lodash';
import { z } from 'zod';

const datenExportParticipantIdsSchema = z.array(z.number().int().positive()).min(1).max(1000);

const participantExportSelect = {
    contactMail: true,
    contactName: true,
    contactPhone: true,
    feeEuros: true,
    genres: {
        orderBy: { genre: { name: 'asc' as const } },
        select: { genre: { select: { name: true } } },
    },
    id: true,
    name: true,
    participantCount: true,
    scheduleEntries: {
        orderBy: { startsAt: 'asc' as const },
        select: {
            endsAt: true,
            programLocation: { select: { name: true } },
            startsAt: true,
            timeMode: true,
        },
        where: { kind: ScheduleEntryKind.Participant },
    },
    status: true,
    type: true,
} as const;

export const getDatenExportParticipants = loggedAction(
    'getDatenExportParticipants',
    async (participantIds: Array<number>): Promise<Array<DatenExportParticipant>> => {
        await requireDataPrivacyUser();
        const ids = uniq(datenExportParticipantIdsSchema.parse(participantIds));
        const participants = await prismaClient.participant.findMany({
            select: participantExportSelect,
            where: { id: { in: ids } },
        });
        const byId = new Map(participants.map((participant) => [participant.id, participant]));

        return ids.flatMap((id) => {
            const participant = byId.get(id);

            if (participant === undefined) {
                return [];
            }

            return [
                {
                    contactMail: participant.contactMail,
                    contactName: participant.contactName,
                    contactPhone: participant.contactPhone,
                    feeEuros: participant.feeEuros,
                    genres: participant.genres.map(({ genre }) => genre.name),
                    id: participant.id,
                    name: participant.name,
                    participantCount: participant.participantCount,
                    slots: participant.scheduleEntries.map(
                        (entry) =>
                            formatMailMergeSlotLine({
                                endsAt: entry.endsAt,
                                locationName: entry.programLocation.name,
                                startsAt: entry.startsAt,
                                timeMode: entry.timeMode,
                            }) ?? '',
                    ),
                    status: participant.status,
                    type: participant.type,
                },
            ];
        });
    },
    (participantIds) => ({ context: { count: participantIds.length }, targetType: 'Application' }),
);
