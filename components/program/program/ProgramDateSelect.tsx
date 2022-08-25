import { useCallback } from 'react';
import type { ReactElement } from 'react';
import formatDate from 'lib/common/formatDate';
import type ProgramDate from 'lib/strapi/typings/ProgramDate';

interface Props {
    date: ProgramDate;
    dayIndex: 1 | 2 | 3;
    onDayClick: (index: 1 | 2 | 3) => void;
    isSelected: boolean;
}

const ProgramDateSelect = ({ date, dayIndex, onDayClick, isSelected }: Props): ReactElement => {

    const handleDateClick = useCallback((): void => {
        onDayClick(dayIndex);
    }, [dayIndex, onDayClick]);

    const formattedDay = formatDate(date[0], 'EEEE');

    return (
        <div
            className={`font-display cursor-pointer relative grow h-11 ${isSelected ? 'text-pink-600' : ''} font-bold text-lg z-50`}
            onClick={handleDateClick}
        >
            <div className="absolute z-20 bg-[#ffe698] top-0 right-0 bottom-0 left-0 flex justify-center items-center">
                {formattedDay}
            </div>

            <div className="absolute top-1 left-1 -right-1 -bottom-1 bg-gradient-to-r from-[#e1017e] to-[#33bbe9] z-10" />
        </div>
    );
};

export default ProgramDateSelect;
