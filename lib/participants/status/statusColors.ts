import type { ApplicationStatus } from '@prisma/client';

const statusColors: Record<ApplicationStatus, { badge: string; border: string; header: string; text: string }> = {
    Applied: { badge: 'bg-gray-200', border: 'border-gray-400', header: 'bg-gray-100', text: 'text-gray-900' },
    InConsideration: { badge: 'bg-yellow-200', border: 'border-yellow-500', header: 'bg-yellow-50', text: 'text-yellow-950' },
    Contacted: { badge: 'bg-blue-200', border: 'border-blue-500', header: 'bg-blue-50', text: 'text-blue-950' },
    WaitingForConfirmation: { badge: 'bg-orange-200', border: 'border-orange-500', header: 'bg-orange-50', text: 'text-orange-950' },
    Confirmed: { badge: 'bg-green-200', border: 'border-green-500', header: 'bg-green-50', text: 'text-green-950' },
    Rejected: { badge: 'bg-red-200', border: 'border-red-500', header: 'bg-red-50', text: 'text-red-950' },
    Canceled: { badge: 'bg-gray-300', border: 'border-gray-500', header: 'bg-gray-200', text: 'text-gray-950' },
};

export default statusColors;
