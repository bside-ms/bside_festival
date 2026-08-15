# Pack Slotplan overlaps into minimum Lanes per Overlap Group

ADR 0010 made Overlaps visible with an equal split of the whole connected chain. That overstates the mess: a long entry plus a sequential run became many columns when only two things were on at once. Each Overlap Group now packs to the minimum Lanes (max simultaneous occupancy). Width is 1/N of that group, so separate piles at the same Program Location can be 1/2 and 1/3. Assignment is start time, then longer first, then the leftmost free Lane, so long bars sit left. Overlap is still a clash to clean up, not a shared stage.

**Considered Options:** location-day grid (rejected: empty Lanes, one night clash taxes the afternoon); keep the chain-split (rejected: unreadable); add a badge or hatch as a leftover cleanup mark (rejected: side-by-side is enough).
