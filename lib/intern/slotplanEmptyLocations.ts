export const splitSlotplanPlannerLocations = <T extends { id: number }>(
    locations: Array<T>,
    filledLocationIds: ReadonlySet<number>,
    showEmpty: boolean,
): { emptyCount: number; hiddenEmptyCount: number; visibleLocations: Array<T> } => {
    const emptyCount = locations.filter((location) => !filledLocationIds.has(location.id)).length;

    return {
        emptyCount,
        hiddenEmptyCount: showEmpty ? 0 : emptyCount,
        visibleLocations: showEmpty ? locations : locations.filter((location) => filledLocationIds.has(location.id)),
    };
};
