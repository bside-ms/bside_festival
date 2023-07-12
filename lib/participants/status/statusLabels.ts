import type { ApplicationStatus } from '@prisma/client';

const statusLabels: Record<ApplicationStatus, string> = {
    Applied: 'Beworben',
    Rejected: 'Abgelehnt',
    InProgress: 'In Bearbeitung',
    WaitingForConfirmation: 'Warten auf Bestätigung',
    Confirmed: 'Bestätigt',
};

export default statusLabels;
