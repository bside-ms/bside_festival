import type ProgramItem from 'lib/strapi/typings/ProgramItem';

const useBeginFromItem = (timeTableItem: ProgramItem): Date => {

    if ('Date' in timeTableItem.attributes) {
        return new Date(`${timeTableItem.attributes.Date}T${timeTableItem.attributes.Begin}Z`);
    }

    return new Date(timeTableItem.attributes.Begin);
};

export default useBeginFromItem;
