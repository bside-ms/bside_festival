import type { Attendee } from '@prisma/client';

export default interface AllAttendees {
    slotId: number;
    attendees: Array<Omit<Attendee, 'attendedAt'>>;
}
