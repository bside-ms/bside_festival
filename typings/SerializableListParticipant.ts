import type { ApplicationStatus, Type } from '@prisma/client';

export type ListParticipantEarliestSlot = {
    additionalSlotCount: number;
    locationName: string;
    sortAt: string;
    timeLabel: string;
};

type ListParticipantLastComment = {
    authorName: string;
    createdAt: string;
    text: string;
};

export type SerializableListParticipant = {
    contactName: string | null;
    earliestSlot: ListParticipantEarliestSlot | null;
    feeEuros: number | null;
    id: number;
    lastComment: ListParticipantLastComment | null;
    name: string;
    organizers: Array<{ organizerName: string; organizerUserId: string }>;
    status: ApplicationStatus;
    type: Type;
    updatedAt: string;
};
