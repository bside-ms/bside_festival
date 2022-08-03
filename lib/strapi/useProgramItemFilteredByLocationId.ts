import type FullTimeProgramItem from 'lib/strapi/typings/FullTimeProgramItem';
import type ProgramItem from 'lib/strapi/typings/ProgramItem';

const useProgramItemFilteredByLocationId = <T extends ProgramItem | FullTimeProgramItem>(programItems: Array<T>, locationId: number): Array<T> => (
    programItems.filter(programItem => (
        programItem.attributes.location.data?.id === locationId
    ))
);

export default useProgramItemFilteredByLocationId;
