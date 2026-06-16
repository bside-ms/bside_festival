import type { ApplicationStatus } from '@prisma/client';

const statusLabels: Record<ApplicationStatus, string> = {
    Applied: 'Beworben',
    InConsideration: 'In Prüfung',
    Contacted: 'Kontaktiert',
    Rejected: 'Abgelehnt',
    WaitingForConfirmation: 'Zusage offen',
    Confirmed: 'Bestätigt',
    Canceled: 'Abgesagt',
};

export default statusLabels;
