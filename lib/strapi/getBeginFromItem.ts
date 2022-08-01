import type ProgramItem from 'lib/strapi/typings/ProgramItem';

const getBeginFromItem = (timeTableItem: ProgramItem): Date => {

    if ('Date' in timeTableItem.attributes) {
        return new Date(`${timeTableItem.attributes.Date} ${timeTableItem.attributes.Begin}`);
    }

    return new Date(timeTableItem.attributes.Begin);
};

export default getBeginFromItem;
