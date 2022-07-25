import type TimeTableItem from 'lib/strapi/TimeTableItem';

const useBeginFromItem = (timeTableItem: TimeTableItem): Date => {

    if ('Date' in timeTableItem.attributes) {
        return new Date(`${timeTableItem.attributes.Date}T${timeTableItem.attributes.Begin}Z`);
    }

    return new Date(timeTableItem.attributes.Begin);
};

export default useBeginFromItem;
