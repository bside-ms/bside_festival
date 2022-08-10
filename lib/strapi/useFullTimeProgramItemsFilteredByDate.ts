import type FullTimeProgramItem from 'lib/strapi/typings/FullTimeProgramItem';
import type ProgramDate from 'lib/strapi/typings/ProgramDate';
import useFullTimeProgramItemFilteredByDateFunction from 'lib/strapi/useFullTimeProgramItemFilteredByDateFunction';

const useFullTimeProgramItemsFilteredByDate = <T extends FullTimeProgramItem>(programItems: Array<T>, date: ProgramDate): Array<T> => {

    const fullTimeProgramItemFilteredByDateFunction = useFullTimeProgramItemFilteredByDateFunction();

    return programItems.filter(
        programItem => fullTimeProgramItemFilteredByDateFunction(programItem, date)
    );
};

export default useFullTimeProgramItemsFilteredByDate;
