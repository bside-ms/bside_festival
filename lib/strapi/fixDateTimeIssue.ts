import type Concert from 'lib/strapi/typings/Concert';
import type ProgramItem from 'lib/strapi/typings/ProgramItem';

/**
 * The logic in this function is without a doubt the ugliest part of this
 * whole application, and we shall never speak about it.
 */
const fixDateTimeIssue = <T extends Exclude<ProgramItem, Concert>>(programItem: T): T => {

    if (!('Date' in programItem.attributes)) {
        return programItem;
    }

    const beginHourMatch = /^(\d{1,2}):/.exec(programItem.attributes.Begin);
    const endHourMatch = /^(\d{1,2}):/.exec(programItem.attributes.End);

    if (beginHourMatch === null || endHourMatch === null) {
        return programItem;
    }

    let newBeginHour: string | number = parseInt(beginHourMatch[1]!, 10);
    newBeginHour = newBeginHour - 2;
    if (newBeginHour < 0) {
        newBeginHour = 24 + newBeginHour;
    }

    let newEndHour: string | number = parseInt(endHourMatch[1]!, 10);
    newEndHour = newEndHour - 2;
    if (newEndHour < 0) {
        newEndHour = 24 + newEndHour;
    }

    newBeginHour = newBeginHour.toString();
    newBeginHour = newBeginHour.length === 1 ? `0${newBeginHour}` : newBeginHour;

    newEndHour = newEndHour.toString();
    newEndHour = newEndHour.length === 1 ? `0${newEndHour}` : newEndHour;

    programItem.attributes.Begin = `${programItem.attributes.Date}T${newBeginHour}${programItem.attributes.Begin.slice(2)}Z`;
    programItem.attributes.End = `${programItem.attributes.Date}T${newEndHour}${programItem.attributes.End.slice(2)}Z`;
    programItem.attributes.Date = '';

    return programItem;
};

export default fixDateTimeIssue;
