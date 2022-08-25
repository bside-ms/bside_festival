import useFullTimeProgramItemFilteredByDateFunction from 'lib/program/useFullTimeProgramItemFilteredByDateFunction';
import type FullTimeProgramItem from 'lib/strapi/typings/FullTimeProgramItem';
import type ProgramDate from 'lib/strapi/typings/ProgramDate';

const useFullTimeProgramItemsFilteredByDate = <T extends FullTimeProgramItem>(programItems: Array<T>, date: ProgramDate | null): Array<T> => {

    const fullTimeProgramItemFilteredByDateFunction = useFullTimeProgramItemFilteredByDateFunction();

    if (date === null) {
        return [];
    }

    return programItems.filter(
        programItem => fullTimeProgramItemFilteredByDateFunction(programItem, date)
    );
};

export default useFullTimeProgramItemsFilteredByDate;
