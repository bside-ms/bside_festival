import { addDays, isSameDay, startOfDay } from 'date-fns';

export const festivalStartsAt = new Date('2025-09-19T12:00:00+02:00');
export const festivalEndsAt = new Date('2025-09-21T03:00:00+02:00');
export const scheduleStepMinutes = 15;

export interface FestivalDayView {
    label: string;
    startsAt: Date;
    endsAt: Date;
}

export const festivalDayViews: Array<FestivalDayView> = [
    {
        label: 'Freitag',
        startsAt: new Date('2025-09-19T12:00:00+02:00'),
        endsAt: new Date('2025-09-20T03:00:00+02:00'),
    },
    {
        label: 'Samstag',
        startsAt: new Date('2025-09-20T12:00:00+02:00'),
        endsAt: festivalEndsAt,
    },
];

export const festivalAllDayDates = (): Array<string> => {
    const dates = new Array<string>();
    let currentDate = startOfDay(festivalStartsAt);
    const finalDate = startOfDay(festivalEndsAt);

    while (currentDate <= finalDate) {
        dates.push(currentDate.toISOString().slice(0, 10));
        currentDate = addDays(currentDate, 1);
    }

    return dates.filter((date) => !isSameDay(new Date(`${date}T12:00:00+02:00`), festivalEndsAt));
};
