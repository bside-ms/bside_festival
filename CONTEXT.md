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

A schedulable place in the slot plan, such as a stage, room, area, or external venue. Program locations may be grouped for display, but each one can be scheduled directly.
_Avoid_: Venue, location

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

The internal canonical schedule for the festival. It contains placed participant entries and schedule notes, including timed entries and all-day placements.

### Slotplan-Eintrag

The German UI term for a Schedule Entry.
_Avoid_: Programmpunkt when referring to setup, teardown, or other schedule notes

### Blocking Occupancy

Whether a schedule entry reserves its program location so no other blocking entry may overlap it. Timed entries usually block; all-day placements usually do not.
