import type { ApplicationStatus, Type } from '@prisma/client';

export type DatenExportParticipant = {
    contactMail: string;
    contactName: string | null;
    contactPhone: string | null;
    feeEuros: number | null;
    genres: Array<string>;
    id: number;
    name: string;
    participantCount: number;
    slots: Array<string>;
    status: ApplicationStatus;
    type: Type;
};
