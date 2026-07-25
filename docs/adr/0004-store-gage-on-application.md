# Store Gage on the Application

Gage is stored on the Programmbeitrag (application), not on each Slotplan-Eintrag. Planning lists are often schedule-shaped and some Schedule Notes carry money, but Gage is one contractual fee per act — Friday and Saturday placements of the same contribution share a single amount (“Siehe Freitag”). Putting it on schedule entries would duplicate values, force aggregation in contribution details, and still leave notes without a clean owner.

Schedule Notes that have a fee but no application stay without persisted Gage until they become Beiträge. Gage changes are changelog’d like other application edits; any logged-in intern may edit them in Programmbeiträge details.
