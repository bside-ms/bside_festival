import type { ApplicationStatus } from '@prisma/client';

export const prominentStatusTransitions = new Array<ApplicationStatus>(
    'InConsideration',
    'Contacted',
    'WaitingForConfirmation',
    'Confirmed',
);

export const secondaryStatusTransitions = new Array<ApplicationStatus>('Applied', 'Rejected', 'Canceled');
