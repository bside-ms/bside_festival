import type ProgramDates from 'lib/strapi/typings/ProgramDates';

const getAvailableDates = (): ProgramDates => ([
    [new Date('2022/09/16 07:00'), new Date('2022/09/17 06:59')],
    [new Date('2022/09/17 07:00'), new Date('2022/09/18 06:59')],
    [new Date('2022/09/18 07:00'), new Date('2022/09/19 06:59')],
]);

export default getAvailableDates;
