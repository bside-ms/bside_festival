# Context

## Glossary

### Application

A submitted proposal while it is being reviewed, curated, or edited before becoming part of the published program.

### Application Status

The stage of an application in the festival coordination pipeline. The valid statuses are:

- **Applied (Beworben):** The initial, default state for incoming proposals.
- **In Consideration (Engere Auswahl):** The jury has shortlisted the application.
- **Contacted (Kontaktiert):** The team is in active booking/technical negotiations with the artist.
- **Waiting for Confirmation (Zusage offen):** An offer has been sent, awaiting artist confirmation.
- **Confirmed (Bestätigt):** The artist has confirmed; the act is officially part of the festival program.
- **Rejected (Abgelehnt):** The application was declined by the curation team.
- **Canceled (Abgesagt):** The act was canceled by the artist or team after confirmation/negotiations.

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

### Localness

How local an application is based on the submitted participant postcodes. German postcodes starting with 481, 482, or 483 count as nearby to Muenster; other German postcodes and international entries do not. Localness awards a flat 0.5 bonus when at least half of the submitted postcodes are local, and 0 otherwise (an application with no postcodes scores 0).

### Program Entry

An accepted application as it appears in program planning or the public program, especially when scheduling, venue, or attendance-related information is being changed.

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

### Responsible Organizer

An internal team member assigned to coordinate a specific artist or program entry. Multiple organizers can share responsibility for one artist, and one organizer can be responsible for multiple artists (n:m). Each organizer is identified by their Keycloak user ID and name, which are cached at assignment time to avoid runtime API calls.

### Schedule Entry

Anything placed in the slot plan. A schedule entry is either linked to one application or is a schedule note.
_Avoid_: Slot, venue

### Schedule Note

A schedule entry that is not linked to an application, such as setup, changeover, teardown, a pause, or a temporary planning reservation.
_Avoid_: Info block, program entry

### Slotplan

The internal canonical schedule for the festival. It contains placed participant entries and schedule notes. Every Schedule Entry has a start and an end. The Slotplan page is a viewport-owned intern workspace: the intern `AppShell` fills the screen (`h-dvh`), the marketing footer is hidden, and the grid uses the remaining height.

### Slotplan-Eintrag

The German UI term for a Schedule Entry.
_Avoid_: Programmpunkt when referring to setup, teardown, or other schedule notes

### Overlap

Two or more Schedule Entries at the same Program Location that share any time, even a few minutes. The Slotplan shows them side by side for their full duration so the clash can be found and cleaned up. Overlap is allowed so it is visible; it is not a lasting way to share a Program Location.
_Avoid_: Collision, conflict, Blocking Occupancy, shared stage (as an intended format)
