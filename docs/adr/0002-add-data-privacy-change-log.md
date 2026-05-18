# Add Data-Privacy Change Log

The system records a lightweight Change Log for successful changes made by logged-in users to applications and program entries. Change Log entries are visible only to data-privacy users, include actor name and email snapshots, target ID and name snapshots, raw and German display values, and previous and new values when available. Database changes and their Change Log entries are written transactionally so an internal edit does not succeed without its corresponding history.

This favors a readable internal history over a compliance-grade audit trail. It keeps enough structured data for filtering and debugging, while avoiding broader access to sensitive historical values by limiting the read surface to data-privacy users.
