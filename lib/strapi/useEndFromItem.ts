import type ProgramItem from 'lib/strapi/typings/ProgramItem';

const useEndFromItem = (timeTableItem: ProgramItem): Date => {

    if ('Date' in timeTableItem.attributes) {
        return new Date(`${timeTableItem.attributes.Date}T${timeTableItem.attributes.End}Z`);
    }

    return new Date(timeTableItem.attributes.End);
};

export default useEndFromItem;
