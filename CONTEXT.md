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

Additional points awarded from selection criteria such as FLINTA\* participation, marginalized participation, first-time participation, and localness.

### Change Log

A lightweight history of successful changes made by logged-in users. It is visible only to data-privacy users. Each entry represents one user save action, records who changed what and when, identifies the user by the name and email address captured at the time of the change, and uses human-readable event descriptions with previous and new values when those values are available.

### Comment

An immutable internal note posted by an organizer on an application. Comments cannot be edited or deleted after posting. Each comment records the author's Keycloak name and user ID at the time of posting. A comment may optionally be linked to a status transition, in which case it appears in the activity timeline as the reason or context for that status change.

### Data-Privacy User

A logged-in user who may access personal or sensitive submitted data such as contact details and the Change Log.

### Final Curation Score

The total score used during curation, calculated from the jury score and the bonus score. It is calculated with full precision and rounded only when displayed. With the current bonus criteria, the score ranges from 0 to 9.

### First-Time Participation

Whether an application comes from people who have not participated in a previous B-Side Festival. Unknown past participation does not receive the first-time participation bonus.

### Jury Score

The average of all jury votes for one application. Applications without jury votes are not curated yet, and applications may have different numbers of jury votes.

### Jury Vote

A score from 0 to 5 from one internal curator during the shared curation session. Votes are anonymous and entered together by one person after the group has reviewed an application.

### Localness

How local an application is based on the submitted participant postcodes. German postcodes starting with 481, 482, or 483 count as nearby to Muenster; other German postcodes and international entries do not. Localness is proportional to the submitted postcode entries.

### Program Entry

An accepted application as it appears in program planning or the public program, especially when scheduling, venue, or attendance-related information is being changed.

### Programmbeiträge

The canonical internal name for the unified internal workspace at `/intern`. It covers every festival contribution — concerts, workshops, food stands, exhibitions, and all other types — across all lifecycle stages from initial application to confirmed act. This is the operational hub for organizers managing artists and program entries.

### Responsible Organizer

An internal team member assigned to coordinate a specific artist or program entry. Multiple organizers can share responsibility for one artist, and one organizer can be responsible for multiple artists (n:m). Each organizer is identified by their Keycloak user ID and name, which are cached at assignment time to avoid runtime API calls.
