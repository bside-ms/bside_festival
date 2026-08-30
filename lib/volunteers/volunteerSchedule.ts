const volunteerSignupClosesAt = new Date('2026-09-16T00:00:00+02:00');

export const isVolunteerSignupOpen = (now: Date = new Date()): boolean => now < volunteerSignupClosesAt;

type HelfiMeeting = {
    startsAt: Date;
    text: string;
};

const helfiMeetings: HelfiMeeting[] = [
    {
        startsAt: new Date('2026-09-02T18:00:00+02:00'),
        text: 'Mittwoch, 02.09.2026, 18:00–19:00 Uhr, Gruppenraum 1',
    },
    {
        startsAt: new Date('2026-09-07T17:00:00+02:00'),
        text: 'Montag, 07.09.2026, 17:00–18:00 Uhr, Gruppenraum 3',
    },
];

const awarenessWorkshop = {
    startsAt: new Date('2026-09-07T19:00:00+02:00'),
    text: 'Montag, 07.09.2026, 19:00 Uhr, KV Gruppen-Raum',
};

export const getUpcomingHelfiMeetings = (now: Date = new Date()): HelfiMeeting[] =>
    helfiMeetings.filter((meeting) => meeting.startsAt > now);

export const hasUpcomingAwarenessWorkshop = (now: Date = new Date()): boolean => awarenessWorkshop.startsAt > now;

export const upcomingAwarenessWorkshopText = awarenessWorkshop.text;
