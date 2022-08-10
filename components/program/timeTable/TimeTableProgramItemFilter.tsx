import { useCallback } from 'react';
import type { ReactElement } from 'react';
import type { ProgramItemTypeFilter } from 'lib/context/ProgramItemTypeFiltersContext';
import { useProgramItemTypeFiltersContext } from 'lib/context/ProgramItemTypeFiltersContext';

interface Props {
    programItemTypeFilter: ProgramItemTypeFilter;
}

const TimeTableProgramItemFilter = ({ programItemTypeFilter: { label, value } }: Props): ReactElement => {

    const { isProgramItemTypeFiltered, toggleProgramItemTypeFilter } = useProgramItemTypeFiltersContext();

    const isFiltered = isProgramItemTypeFiltered(value);

    const handleClick = useCallback(
        () => toggleProgramItemTypeFilter(value),
        [toggleProgramItemTypeFilter, value]
    );

    if (isFiltered) {
        return (
            <div
                onClick={handleClick}
                className="cursor-pointer rounded bg-gray-100 hover:bg-gray-200 text-gray-800 px-2 py-0.5 border-[1px] border-gray-300"
            >
                {label}
            </div>
        );
    }

    return (
        <div
            onClick={handleClick}
            className="cursor-pointer rounded bg-gray-100 hover:bg-gray-200 text-gray-800 px-2 py-0.5 border-[1px] border-gray-600"
        >
            {label}
        </div>
    );
};

export default TimeTableProgramItemFilter;
