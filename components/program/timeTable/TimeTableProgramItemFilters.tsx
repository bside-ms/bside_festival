import type { ReactElement } from 'react';
import TimeTableProgramItemFilter from 'components/program/timeTable/TimeTableProgramItemFilter';
import { availableProgramItemTypeFilters } from 'lib/context/ProgramItemTypeFiltersContext';

const TimeTableProgramItemFilters = (): ReactElement => {

    return (
        <div className="my-4">
            <div className="font-bold mb-1 text-sm">
                Filter
            </div>
            <div className="flex gap-2 overflow-y-scroll text-xs">
                {availableProgramItemTypeFilters.map(filter => (
                    <TimeTableProgramItemFilter
                        key={filter.value}
                        programItemTypeFilter={filter}
                    />
                ))}
            </div>
        </div>
    );
};

export default TimeTableProgramItemFilters;
