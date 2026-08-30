import type { Volunteer } from '@prisma/client';
import { getUpcomingHelfiMeetings, hasUpcomingAwarenessWorkshop, upcomingAwarenessWorkshopText } from '../volunteers/volunteerSchedule';
import createMailHtml, { mailButtonStyle, mailLinkStyle, mailParagraphStyle } from './createMailHtml';
import { escapeHtml } from './escapeHtml';

const engelsystemUrl = 'https://festival26.support.b-side.ms';
const engelsystemRegistrationUrl = `${engelsystemUrl}/register`;

export const volunteerOnboardingMailSubject = 'B-Side Festival 2026: Jetzt im Engelsystem registrieren';

type VolunteerOnboardingMail = {
    html: string;
    text: string;
};

const createHelfiMeetingsHtml = (now: Date): string => {
    const upcomingHelfiMeetings = getUpcomingHelfiMeetings(now);

    if (upcomingHelfiMeetings.length === 0) {
        return `<p style="${mailParagraphStyle}">Möglicherweise bieten wir kurzfristig noch ein Helfi-Treffen an. Wir informieren dich, falls ein weiterer Termin zustande kommt.</p>`;
    }

    return `
        <p style="${mailParagraphStyle}">Bei unseren Helfi-Treffen erklären wir dir die B-Side, das Festival und die Aufgabenbereiche. Ein Treffen reicht völlig aus, besonders wenn du die B-Side oder das Festival noch nicht so gut kennst:</p>
        <ul style="${mailParagraphStyle};padding-left:20px">
            ${upcomingHelfiMeetings.map((meeting) => `<li>${meeting.text}</li>`).join('')}
        </ul>
    `;
};

const createAwarenessHtml = (now: Date): string => {
    const registrationHint =
        'Wenn du Awareness-Schichten übernehmen möchtest, setze bei der Registrierung bitte auch den Haken bei „Awareness“. ';

    if (!hasUpcomingAwarenessWorkshop(now)) {
        return `<p style="${mailParagraphStyle}">${registrationHint}Für Awareness-Schichten brauchst du entsprechende Erfahrung. Möglicherweise bieten wir noch einen weiteren Workshop an.</p>`;
    }

    return `<p style="${mailParagraphStyle}">${registrationHint}Freigeschaltet werden Personen, die einen Awareness-Workshop besucht haben oder vergleichbare Erfahrungen mitbringen. Der nächste Awareness-Workshop findet am ${upcomingAwarenessWorkshopText} statt. Nach der Wendeltreppe gehst du durch die Glastür zu den internen Büros und dann den Flur entlang.</p>`;
};

const createHelfiMeetingsText = (now: Date): string => {
    const upcomingHelfiMeetings = getUpcomingHelfiMeetings(now);

    if (upcomingHelfiMeetings.length === 0) {
        return 'Möglicherweise bieten wir kurzfristig noch ein Helfi-Treffen an. Wir informieren dich, falls ein weiterer Termin zustande kommt.';
    }

    return `Bei unseren Helfi-Treffen erklären wir dir die B-Side, das Festival und die Aufgabenbereiche. Ein Treffen reicht völlig aus, besonders wenn du die B-Side oder das Festival noch nicht so gut kennst:

${upcomingHelfiMeetings.map((meeting) => `- ${meeting.text}`).join('\n')}`;
};

const createAwarenessText = (now: Date): string => {
    const registrationHint =
        'Wenn du Awareness-Schichten übernehmen möchtest, setze bei der Registrierung bitte auch den Haken bei „Awareness“. ';

    if (!hasUpcomingAwarenessWorkshop(now)) {
        return `${registrationHint}Für Awareness-Schichten brauchst du entsprechende Erfahrung. Möglicherweise bieten wir noch einen weiteren Workshop an.`;
    }

    return `${registrationHint}Freigeschaltet werden Personen, die einen Awareness-Workshop besucht haben oder vergleichbare Erfahrungen mitbringen. Der nächste Awareness-Workshop findet am ${upcomingAwarenessWorkshopText} statt. Nach der Wendeltreppe gehst du durch die Glastür zu den internen Büros und dann den Flur entlang.`;
};

export const createVolunteerOnboardingMail = (volunteer: Volunteer, now: Date = new Date()): VolunteerOnboardingMail => {
    const escapedName = escapeHtml(volunteer.fullName);
    const html = createMailHtml(`
        <p style="${mailParagraphStyle}"><strong>Hallo ${escapedName},</strong></p>
        <p style="${mailParagraphStyle}">schön, dass du als Helfer*in beim B-Side Festival dabei bist!</p>
        <p style="${mailParagraphStyle}">Damit du dir deine gewünschten Schichten aussuchen kannst, registriere dich jetzt einmalig im Engelsystem:</p>
        <p style="${mailParagraphStyle}">
            <a href="${engelsystemRegistrationUrl}" style="${mailButtonStyle}">Im Engelsystem registrieren</a>
        </p>
        <p style="${mailParagraphStyle}">Danach findest du alle Schichten im <a href="${engelsystemUrl}" style="${mailLinkStyle}">Engelsystem</a> und kannst dich eintragen.</p>
        <p style="${mailParagraphStyle}"><strong>Bitte setze unter „E-Mail Einstellungen“ beide Haken.</strong> Sie sind nicht verpflichtend, aber sehr wichtig: Nur so können wir dich bei Schichtänderungen, privaten Nachrichten und Festivalinfos zuverlässig erreichen.</p>
        ${createHelfiMeetingsHtml(now)}
        ${createAwarenessHtml(now)}
        <p style="${mailParagraphStyle}">Für kurzfristige Infos während des Festivals gibt es außerdem eine Telegram-Gruppe. Den Einladungslink bekommst du kurz vor dem Festival.</p>
        <p style="${mailParagraphStyle}">Bei Fragen erreichst du uns unter <a href="mailto:festival@b-side.ms" style="${mailLinkStyle}">festival@b-side.ms</a>.</p>
        <p style="${mailParagraphStyle}">Wir freuen uns auf dich!<br>das Festival-Team</p>
    `);
    const text = `Hallo ${volunteer.fullName},

schön, dass du als Helfer*in beim B-Side Festival dabei bist!

Damit du dir deine gewünschten Schichten aussuchen kannst, registriere dich jetzt einmalig im Engelsystem:
${engelsystemRegistrationUrl}

Danach findest du alle Schichten im Engelsystem und kannst dich eintragen:
${engelsystemUrl}

Bitte setze unter „E-Mail Einstellungen“ beide Haken. Sie sind nicht verpflichtend, aber sehr wichtig: Nur so können wir dich bei Schichtänderungen, privaten Nachrichten und Festivalinfos zuverlässig erreichen.

${createHelfiMeetingsText(now)}

${createAwarenessText(now)}

Für kurzfristige Infos während des Festivals gibt es außerdem eine Telegram-Gruppe. Den Einladungslink bekommst du kurz vor dem Festival.

Bei Fragen erreichst du uns unter festival@b-side.ms.

Wir freuen uns auf dich!
das Festival-Team
`;

    return { html, text };
};
