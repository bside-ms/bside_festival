export const workshopReservationTtlMs = 24 * 60 * 60 * 1000;

export const activeWorkshopReservationWhere = () => ({
    OR: [{ confirmedAt: { not: null } }, { attendedAt: { gte: new Date(Date.now() - workshopReservationTtlMs) } }],
});
