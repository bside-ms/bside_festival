import { isWithinInterval } from 'date-fns';

const applicationStart = new Date('2026-04-19');
const applicationEnd = new Date('2026-05-10');

const isWithinApplicationPhase = (): boolean => isWithinInterval(new Date(), { start: applicationStart, end: applicationEnd });

export default isWithinApplicationPhase;
