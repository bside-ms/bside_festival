import type { ApplicationStatus } from '@prisma/client';

const statusOrder = new Array<ApplicationStatus>(
    'Applied',
    'InConsideration',
    'Contacted',
    'WaitingForConfirmation',
    'Confirmed',
    'Canceled',
    'Rejected',
);

export default statusOrder;
