import type { Volunteer } from '@prisma/client';
import { describe, expect, it } from 'vitest';
import { createVolunteerOnboardingMail, volunteerOnboardingMailSubject } from './createVolunteerOnboardingMail';

const volunteer = {
    additionalInfo: null,
    createdAt: new Date('2026-08-28T12:00:00+02:00'),
    emailVerified: new Date('2026-08-28T12:00:00+02:00'),
    fullName: 'Alex Müller',
    int: 1,
    mailAddress: 'alex@example.com',
    phoneNumber: '+49123456789',
} satisfies Volunteer;

describe('createVolunteerOnboardingMail', () => {
    it('includes the current registration and meeting information', () => {
        const mail = createVolunteerOnboardingMail(volunteer, new Date('2026-08-28T12:00:00+02:00'));

        expect(volunteerOnboardingMailSubject).toBe('B-Side Festival 2026: Jetzt im Engelsystem registrieren');
        expect(mail.text).toContain('https://festival26.support.b-side.ms/register');
        expect(mail.text).toContain('Mittwoch, 02.09.2026, 18:00–19:00 Uhr, Gruppenraum 1');
        expect(mail.text).toContain('Montag, 07.09.2026, 17:00–18:00 Uhr, Gruppenraum 3');
        expect(mail.text).toContain('Montag, 07.09.2026, 19:00 Uhr, KV Gruppen-Raum');
        expect(mail.html).toContain('Hallo Alex Müller');
    });

    it('does not announce past meetings or the past Awareness workshop', () => {
        const mail = createVolunteerOnboardingMail(volunteer, new Date('2026-09-07T17:00:00+02:00'));

        expect(mail.text).not.toContain('Gruppenraum 1');
        expect(mail.text).not.toContain('Gruppenraum 3');
        expect(mail.text).not.toContain('KV Gruppen-Raum');
        expect(mail.text).toContain('Möglicherweise bieten wir kurzfristig noch ein Helfi-Treffen an.');
        expect(mail.text).toContain('Möglicherweise bieten wir noch einen weiteren Workshop an.');
    });
});
