# Context

## Glossary

### B-Side

The venue and cultural space in Münster (Am Mittelhafen 42), and the short name used when referring to that place rather than the festival.
_Avoid_: B Side, BSide (as venue name)

### B-Side Festival

The canonical public name of the festival. Written with a hyphen in “B-Side” and a space before “Festival”.
_Avoid_: B-Side-Festival, B Side Festival, BSide Festival

### B-Side Kultur e.V.

The non-profit association that organizes the B-Side Festival and year-round cultural programming.
_Avoid_: B Side Kultur, the festival (when the legal organizer is meant)

### Galerie

The public homepage recap of a past B-Side Festival edition. Each image names its photographer directly: Gideon Rothmann for files credited to him and Laura Windheuser for the remaining 2025 images.
_Avoid_: uncredited photo grid, placeholder gallery

### Awareness

The festival’s public safety and anti-discrimination offering: a short homepage teaser plus a full dedicated page, with English, Leichte Sprache, and Easy Language alternates of the full page. The German page eyebrow may say Awareness & Safety; the page name stays Awareness.
_Avoid_: Safer Space (as the page name)

### Helfi

A person who signs up publicly to help run the festival (crew). Public UI may also say Helfer\*in; the casual festival term is Helfi. Signup collects name, email, phone, and an optional free-text note (rough availability or car; empty is fine). Copy should not imply special skills or experience. Day checkboxes are not collected up front. Email must be confirmed before the signup counts as complete. The first mail only asks to confirm the address; after the click, a second mail covers onboarding (the Engelsystem, Treffen, Telegram during the festival, festival mail for questions). The 2026 public signup closes on 16 September at 00:00 local festival time, while confirmations for a signup started before the cutoff remain valid. Once closed, the public homepage and signup page invite people to attend the imminent festival and help next year. Organizers read the notes on `/mithelfen/uebersicht`.
_Avoid_: Volunteer (in public German UI), Engelsystem user (as the public label)

### Engelsystem

The public shift-planning tool for the B-Side Festival. Helfis register there once, choose their desired shifts, and are strongly asked to activate both email settings so that changes and festival information can reach them; the settings are not a prerequisite for taking shifts.
_Avoid_: Schichtsystem (when referring to the named tool)

### Awareness-Freischaltung

Permission to choose Awareness shifts in the Engelsystem. It is granted after an Awareness workshop, previously acquired comparable knowledge, or equivalent experience; interested Helfis signal this by selecting Awareness during Engelsystem registration.

### Helfi-Treffen

A general introductory meeting for Helfis that explains the B-Side, the festival, and the available tasks. Attending one meeting is sufficient and is especially useful for people new to the B-Side or the festival.
_Avoid_: Awareness-Workshop (a separate qualification)

### Mitwirken

The public “get involved” area: homepage section and nav group covering Helfis, workshops, and related calls to action. Open Call for program contributions is closed for 2026. The Helfi signup page includes short prose on possible tasks and on next steps after signup (confirm email, later Schichtpläne, Treffen, Telegram during the festival).
_Avoid_: Get Involved, Explore (as nav labels)

### Application

A submitted proposal while it is being reviewed, curated, or edited before becoming part of the published program.

### Application Status

The stage of an application in the festival coordination pipeline. The valid statuses are:

- **Applied (Beworben):** The initial, default state for incoming proposals.
- **In Consideration (Engere Auswahl):** The jury has shortlisted the application.
- **Contacted (Kontaktiert):** The team is in active booking/technical negotiations with the artist.
- **Waiting for Confirmation (Zusage offen):** An offer has been sent, awaiting artist confirmation.
- **Confirmed (Bestätigt):** The artist has confirmed; the act is officially part of the festival program.
- **Rejected (Abgelehnt):** The application is out of the program. This covers a festival decline and an applicant withdrawal before the act was confirmed. Who said no, and why, lives in the comment.
- **Canceled (Abgesagt):** The act left the program after it was confirmed. It can still appear in the public program with a cancellation notice.

### Bonus Score

Additional points awarded from selection criteria: FLINTA\* participation, marginalized participation, and localness. First-time participation is still recorded on applications but no longer contributes to the score.

### Change Log

A lightweight history of successful changes made by logged-in users. It is visible only to data-privacy users. Each entry represents one user save action, records who changed what and when, identifies the user by the name and email address captured at the time of the change, and uses human-readable event descriptions with previous and new values when those values are available.

### Comment

An immutable internal note posted by an organizer on an application. Comments cannot be edited or deleted after posting. Each comment records the author's Keycloak name and user ID at the time of posting. A comment may optionally be linked to a status transition, in which case it appears in the activity timeline as the reason or context for that status change.

### Data-Privacy User

A logged-in user who may access personal or sensitive submitted data such as contact details and the Change Log.

### Final Curation Score

The total score used during curation, calculated as the jury score weighted by 1.5 plus the bonus score. It is calculated with full precision and rounded only when displayed. With the current criteria, the score ranges from 0 to 10 (jury 0–7.5 after weighting, plus bonus 0–2.5).

### Gage

The agreed fee in whole euros for one Programmbeitrag (application). It is optional until set and is one value for the act, not per schedule entry — Friday and Saturday placements of the same act share the same Gage.
_Avoid_: Fee, payment, honorarium (as domain/UI terms)

For concerts/bands, Gage is set from **artist count** (`participantCount`) and whether professionals are involved (`professionalParticipantsCount` / `isProfessionalBooking`), not by copying the predecessor on a vacated slot. Observed 2026 hobby band bands (no professionals): **100 / 150 / 200 / 250 €** for **n = 1 / 2 / 3 / 4+** (typical bands cap at 250; larger special formats like a choir may sit higher). Mixed acts usually add about **+55 € per professional** on that base (e.g. n=4 +1 professional → 305 €). Fully professional or special cases can deviate — check peers before locking. Solo DJs are typically **100 €**; B2B/duo DJ sets often **150 €**. See `docs/adr/0005-gage-from-artist-count-and-professionals.md`.

### First-Time Participation

Whether an application comes from people who have not participated in a previous B-Side Festival. It is collected on the public application form and editable in the application details view, but no longer affects the curation score.

### Jury Score

The average of all jury votes for one application. Applications without jury votes are not curated yet, and applications may have different numbers of jury votes.

### Jury Vote

A score from 0 to 5 from one internal curator during the shared curation session. Votes are anonymous and entered together by one person after the group has reviewed an application.

### Leichte Sprache

A plain, simplified German alternate of selected public pages for easier reading. It is a separate content version, not a visual redesign of the marketing site. On this site it covers Start and Awareness only.
_Avoid_: Easy language homepage mirror, simplified design variant

### Wo & Wann

The public homepage section that presents festival dates, times, and places to visit. Individual places in this section are called **Orte**. Marketing counts (days, places, program items) are approximate and may be updated without a design change.
_Avoid_: Stages, Locations (as section title or public place noun)

### Ort

A visitor-facing place in the public Wo & Wann section (a room, stage, bar, partner venue, etc.). Distinct from the internal scheduling term Program Location / Programmort. B-Side rooms formerly labeled Gruppenraum 1–3 are shown publicly as Raum 1–3.
_Avoid_: Location, Stage (as the general public noun), Gruppenraum (as the public label for Raum 1–3)

### Localness

How local an application is based on the submitted participant postcodes. German postcodes starting with 481, 482, or 483 count as nearby to Muenster; other German postcodes and international entries do not. Localness awards a flat 0.5 bonus when at least half of the submitted postcodes are local, and 0 otherwise (an application with no postcodes scores 0).

### Program Entry

An accepted application as it appears in program planning or the public program, especially when scheduling, venue, or attendance-related information is being changed. The public program includes Confirmed entries and Canceled entries, which remain visible with a cancellation notice.

### Sharepic

A branded image of one Program Entry for posting on social media, including that entry’s public times and places. It exists as a Feed or Story variant, with or without the Program Entry photo, in German or English (times only; places stay German). Without a photo, the name sits in the image card. Anyone with the URL can download it; the public program does not link to it.
_Avoid_: Open Graph image, Social Preview, Poster (when meaning this graphic)

### Program Section

A visitor-facing, color-coded grouping of Program Entries in the public catalog. A Program Section can combine stored types; the Musik section contains both concerts and DJs and shares one color. A detail page retains its stored type label, such as DJs, in that section color.
_Avoid_: Type (when referring to a public catalog grouping)

The sections appear in this order: Musik; Workshops; Lesungen, Vorträge & Poesie; Performance, Theater & Kabarett; Familienprogramm; Ausstellungen; Essensstände; Nachbarschaft; Infostände; Catering; Sonstiges.

### Program Location

A schedulable place in the slot plan, such as a stage, room, area, or external venue. Program locations may be grouped for display, but each one can be scheduled directly. Each has an implicit character (for example dancefloor, rock bar, intimate room, workshop room) that comes from the real place and from what the festival actually programs there.
_Avoid_: Venue, location

### Program Location Area

A display and planning group of Program Locations: **B-Side** (in the house), **Im Viertel** (partner places in the neighborhood), and **Sputnikhalle** (aftershow).
_Avoid_: District, zone, venue group

### Ortspassung

Whether a Programmbeitrag’s format belongs at a given Program Location. A free time window is not enough; booking only places an act where the location character fits (for example spoken word in an intimate listening room, not in a club or loud concert bar). Character comes from the real place and from what the festival actually programs there.
_Avoid_: Just “free slot”, calendar gap

### Location Character

The typical use of a Program Location in festival planning — for example listening/spoken word, dancefloor, concert bar, workshop room, exhibition room, or aftershow. Used to judge Ortspassung before moving acts.
_Avoid_: Vibe (as a planning term), venue type

### Programmort

The German UI term for a Program Location.
_Avoid_: Location, Venue

### Programmbeiträge

The canonical internal name for the unified internal workspace at `/intern`. It covers every festival contribution — concerts, workshops, food stands, exhibitions, and all other types — across all lifecycle stages from initial application to confirmed act. This is the operational hub for organizers managing artists and program entries.
_Avoid_: Intern (as a place name, e.g. “im Intern”)

### Responsible Organizer

An internal team member assigned to coordinate a specific artist or program entry. Multiple organizers can share responsibility for one artist, and one organizer can be responsible for multiple artists (n:m). Each organizer is identified by their Keycloak user ID and name, which are cached at assignment time to avoid runtime API calls.

### Schedule Entry

Anything placed in the slot plan. A schedule entry is either linked to one application or is a schedule note.
_Avoid_: Slot, venue

### Schedule Note

A schedule entry that is not linked to an application, such as setup, changeover, teardown, a pause, or a temporary planning reservation.
_Avoid_: Info block, program entry

### Slotplan

The internal canonical schedule for the festival. It contains placed participant entries and schedule notes. Every Schedule Entry has a start and an end. The Slotplan page is a viewport-owned intern workspace: the intern `AppShell` fills the screen (`h-dvh`), the marketing footer is hidden, and the grid uses the remaining height. Program Locations with no visible Schedule Entry on the selected day are hidden until shown again.

### Slotplan-Eintrag

The German UI term for a Schedule Entry.
_Avoid_: Programmpunkt when referring to setup, teardown, or other schedule notes

### Overlap

Two or more Schedule Entries at the same Program Location that share any time, even a few minutes. The Slotplan places them in different Lanes so the clash can be found and cleaned up. Overlap is allowed so it is visible; it is not a lasting way to share a Program Location.
_Avoid_: Collision, conflict, Blocking Occupancy, shared stage (as an intended format)

### Overlap Group

Schedule Entries at one Program Location that are linked through Overlaps. If A overlaps B and B overlaps C, all three are one group even when A and C do not overlap. Each group has its own Lanes.
_Avoid_: chain, cluster, pile

### Lane

A vertical strip inside one Program Location on the Slotplan. A Schedule Entry stays in one Lane for its whole time. Overlapping entries take different Lanes. How many Lanes an Overlap Group uses equals how many of its entries occupy the place at the same time; another group at the same place can use a different count.
_Avoid_: chain, overlap column, column (when meaning a strip inside a Program Location)
