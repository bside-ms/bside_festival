import { describe, expect, it } from 'vitest';
import { getUpcomingHelfiMeetings, hasUpcomingAwarenessWorkshop, isVolunteerSignupOpen } from './volunteerSchedule';

describe('isVolunteerSignupOpen', () => {
    it('closes the public signup at the start of 16 September in festival time', () => {
        expect(isVolunteerSignupOpen(new Date('2026-09-15T23:59:59+02:00'))).toBe(true);
        expect(isVolunteerSignupOpen(new Date('2026-09-16T00:00:00+02:00'))).toBe(false);
    });
});

describe('getUpcomingHelfiMeetings', () => {
    it('only returns meetings that have not started yet', () => {
        expect(getUpcomingHelfiMeetings(new Date('2026-09-02T18:00:00+02:00'))).toHaveLength(1);
        expect(getUpcomingHelfiMeetings(new Date('2026-09-07T17:00:00+02:00'))).toHaveLength(0);
    });
});

describe('hasUpcomingAwarenessWorkshop', () => {
    it('stops advertising the workshop at its start time', () => {
        expect(hasUpcomingAwarenessWorkshop(new Date('2026-09-07T18:59:59+02:00'))).toBe(true);
        expect(hasUpcomingAwarenessWorkshop(new Date('2026-09-07T19:00:00+02:00'))).toBe(false);
    });
});
