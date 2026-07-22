# Use One Canonical Slotplan Model

The festival schedule is modeled as one canonical slot plan instead of preserving separate `Slot` and `Venue` concepts. A schedule entry can represent a timed participant entry, an all-day participant placement, or a schedule note, which keeps internal planning, public program rendering, conflict validation, and attendee registration on the same source of truth while public visibility remains controlled by participant status.
