# Slotplan overlaps are visible, not blocked

A Schedule Entry no longer exclusively reserves its Program Location. Two entries that share any time at the same place are an Overlap: allowed so the Slotplan can show them side by side, then cleaned up. We drop Blocking Occupancy (the save-time overlap error and the per-entry flag) because the real overlaps were already created by unchecking “blockiert” and then became invisible. Width is an equal split of the whole connected chain (1/2, 1/3, …) for each entry’s full duration — a cleanup signal, not a shared-stage layout.
