import useFullTimeProgramItemFilteredByDateFunction from 'lib/program/useFullTimeProgramItemFilteredByDateFunction';
import useProgramItemFilteredByDateFunction from 'lib/program/useProgramItemFilteredByDateFunction';
import type AllFullTimeProgramItems from 'lib/strapi/typings/AllFullTimeProgramItems';
import type AllProgramItems from 'lib/strapi/typings/AllProgramItems';
import type FullTimeProgramItem from 'lib/strapi/typings/FullTimeProgramItem';
import type ProgramItem from 'lib/strapi/typings/ProgramItem';

const useCumulativeProgramItemsAmount = (allProgramItems: AllProgramItems, allFullTimeProgramItems: AllFullTimeProgramItems): number => {

    const programItemFilteredByDateFunction = useProgramItemFilteredByDateFunction();
    const fullTimeProgramItemFilteredByDateFunction = useFullTimeProgramItemFilteredByDateFunction();

    const allProgramItemsCount = Object.values(allProgramItems).reduce<number>(
        (count, programItems: Array<ProgramItem> | null): number => {

            if (programItems === null) {
                return count;
            }

            const programItemsFilteredByDate = programItems.filter(
                programItem => programItemFilteredByDateFunction(programItem)
            );

            return count + programItemsFilteredByDate.length;
        },
        0
    );

    const allFullTimeProgramItemsCount = Object.values(allFullTimeProgramItems).reduce<number>(
        (count, programItems: Array<FullTimeProgramItem> | null): number => {

            if (programItems === null) {
                return count;
            }

            const programItemsFilteredByDate = programItems.filter(
                programItem => fullTimeProgramItemFilteredByDateFunction(programItem)
            );

            return count + programItemsFilteredByDate.length;
        },
        0
    );

    return allProgramItemsCount + allFullTimeProgramItemsCount;
};

export default useCumulativeProgramItemsAmount;
