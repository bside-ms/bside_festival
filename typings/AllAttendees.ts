import type { Attendee } from '@prisma/client';

export default interface AllAttendees {
    scheduleEntryId: number;
    attendees: Array<Omit<Attendee, 'attendedAt'>>;
}
