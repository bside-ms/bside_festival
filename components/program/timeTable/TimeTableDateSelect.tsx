import { useCallback } from 'react';
import type { ReactElement } from 'react';
import formatDate from 'lib/common/formatDate';
import type ProgramDate from 'lib/strapi/typings/ProgramDate';

interface Props {
    date: ProgramDate;
    handleDateChange: (date: ProgramDate) => void;
    isSelected: boolean;
}

const TimeTableDateSelect = ({ date, handleDateChange, isSelected }: Props): ReactElement => {

    const handleClick = useCallback(
        () => handleDateChange(date),
        [date, handleDateChange]
    );

    const formattedDate = formatDate(date[0], 'EEEE, dd.MM.yyyy');

    if (isSelected) {
        return (
            <div className="rounded bg-gray-300 text-gray-800 px-2 py-0.5">
                {formattedDate}
            </div>
        );

    }

    return (
        <a
            onClick={handleClick}
            className="cursor-pointer rounded bg-gray-800 text-gray-200 hover:bg-gray-700 px-2 py-0.5"
        >
            {formattedDate}
        </a>
    );
};

export default TimeTableDateSelect;
