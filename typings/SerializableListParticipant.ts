import type { ApplicationStatus, Type } from '@prisma/client';

export type ListParticipantEarliestSlot = {
    additionalSlotCount: number;
    locationName: string;
    sortAt: string;
    timeLabel: string;
};

export type ListParticipantScheduleAreas = {
    hasUnassignedScheduleEntry: boolean;
    programLocationAreaIds: Array<number>;
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
    hasUnassignedScheduleEntry: boolean;
    id: number;
    lastComment: ListParticipantLastComment | null;
    name: string;
    organizers: Array<{ organizerName: string; organizerUserId: string }>;
    programLocationAreaIds: Array<number>;
    status: ApplicationStatus;
    type: Type;
    updatedAt: string;
};
