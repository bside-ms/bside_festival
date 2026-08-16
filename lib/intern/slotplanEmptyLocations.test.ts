import { describe, expect, it } from 'vitest';
import { splitSlotplanPlannerLocations } from './slotplanEmptyLocations';

const locations = [{ id: 1 }, { id: 2 }, { id: 3 }];

describe('splitSlotplanPlannerLocations', () => {
    it('hides empty locations by default', () => {
        expect(splitSlotplanPlannerLocations(locations, new Set([2]), false)).toEqual({
            emptyCount: 2,
            hiddenEmptyCount: 2,
            visibleLocations: [{ id: 2 }],
        });
    });

    it('keeps empty locations when showEmpty is on', () => {
        expect(splitSlotplanPlannerLocations(locations, new Set([2]), true)).toEqual({
            emptyCount: 2,
            hiddenEmptyCount: 0,
            visibleLocations: locations,
        });
    });

    it('keeps sort order when every location is filled', () => {
        expect(splitSlotplanPlannerLocations(locations, new Set([1, 2, 3]), false)).toEqual({
            emptyCount: 0,
            hiddenEmptyCount: 0,
            visibleLocations: locations,
        });
    });
});
