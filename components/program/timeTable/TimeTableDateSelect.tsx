import { useCallback } from 'react';
import type { ReactElement } from 'react';
import useFormattedDate from 'lib/common/useFormattedDate';

interface Props {
    date: Date;
    handleDateChange: (date: Date) => void;
    isSelected: boolean;
}

const TimeTableDateSelect = ({ date, handleDateChange, isSelected }: Props): ReactElement => {

    const handleClick = useCallback(
        () => handleDateChange(date),
        [date, handleDateChange]
    );

    const formattedDate = useFormattedDate(date, 'EEEE, dd.MM.yyyy');

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
