import type { ApplicationStatus } from '@prisma/client';

const statusOrder = new Array<ApplicationStatus>(
    'Applied',
    'Rejected',
    'InProgress',
    'WaitingForConfirmation',
    'Confirmed',
);

export default statusOrder;
