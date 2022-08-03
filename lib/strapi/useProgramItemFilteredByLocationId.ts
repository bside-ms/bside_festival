import type Exhibition from 'lib/strapi/typings/Exhibition';
import type ProgramItem from 'lib/strapi/typings/ProgramItem';

const useProgramItemFilteredByLocationId = <T extends ProgramItem | Exhibition>(programItems: Array<T>, locationId: number): Array<T> => (
    programItems.filter(programItem => (
        programItem.attributes.location.data?.id === locationId
    ))
);

export default useProgramItemFilteredByLocationId;
