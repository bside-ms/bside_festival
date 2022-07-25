import { startOfDay } from 'date-fns';

const useAvailableDates = (): [Date, Date, Date] => ([
    new Date('2022-09-16'),
    new Date('2022-09-17'),
    new Date('2022-09-18'),
].map(date => startOfDay(date)) as [Date, Date, Date]);

export default useAvailableDates;
