import { isWithinInterval } from 'date-fns';
import { toDate } from 'date-fns-tz';

const applicationStart = toDate('2026-04-19 00:00:00', { timeZone: 'Europe/Berlin' });
const applicationEnd = toDate('2026-05-24 23:59:59', { timeZone: 'Europe/Berlin' });

export const isWithinApplicationPhase = (): boolean => isWithinInterval(new Date(), { start: applicationStart, end: applicationEnd });
