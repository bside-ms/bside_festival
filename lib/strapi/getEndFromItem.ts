import type ProgramItem from 'lib/strapi/typings/ProgramItem';

const getEndFromItem = (timeTableItem: ProgramItem): Date => {

    if ('Date' in timeTableItem.attributes) {
        return new Date(`${timeTableItem.attributes.Date} ${timeTableItem.attributes.End}`);
    }

    return new Date(timeTableItem.attributes.End);
};

export default getEndFromItem;
