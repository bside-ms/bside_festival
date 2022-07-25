import { addHours, isAfter } from 'date-fns';
import { cloneDeep } from 'lodash';

const useTimeTableHours = (timeTableBegin: Date, timeTableEnd: Date): Array<Date> => {

    let currentTime = cloneDeep(timeTableBegin);

    const hours = new Array<Date>();

    do {
        hours.push(currentTime);
        currentTime = addHours(currentTime, 1);
    } while (!isAfter(currentTime, timeTableEnd));

    return hours;
};

export default useTimeTableHours;
