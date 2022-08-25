import useProgramItemFilteredByDateFunction from 'lib/program/useProgramItemFilteredByDateFunction';
import type ProgramDate from 'lib/strapi/typings/ProgramDate';
import type ProgramItem from 'lib/strapi/typings/ProgramItem';

const useProgramItemFilteredByDate = <T extends ProgramItem>(programItems: Array<T>, date: ProgramDate | null): Array<T> => {

    if (date === null) {
        return [];
    }

    const programItemFilteredByDateFunction = useProgramItemFilteredByDateFunction();

    return programItems.filter(
        programItem => programItemFilteredByDateFunction(programItem, date)
    );
};

export default useProgramItemFilteredByDate;
