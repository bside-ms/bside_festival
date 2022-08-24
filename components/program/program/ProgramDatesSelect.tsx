import { useCallback } from 'react';
import { isSameDay } from 'date-fns';
import type { ReactElement } from 'react';
import ContentWrapper from 'components/common/ContentWrapper';
import { useProgramContext } from 'components/program/program/ProgramContext';
import formatDate from 'lib/common/formatDate';
import getAvailableDates from 'lib/strapi/getAvailableDates';
import type ProgramDate from 'lib/strapi/typings/ProgramDate';

const Date = ({ date, dayIndex }: { date: ProgramDate, dayIndex: number }): ReactElement => {

    const { programDate, setProgramDay } = useProgramContext();

    const handleDateClick = useCallback((): void => {
        setProgramDay(dayIndex as 1 | 2 | 3);
    }, [dayIndex, setProgramDay]);

    const formattedDay = formatDate(date[0], 'EEEE');

    const isSelected = isSameDay(date[0], programDate[0]);

    return (
        <div
            className={`font-display cursor-pointer relative grow h-11 ${isSelected ? 'text-pink-600' : ''} font-bold text-lg z-50`}
            onClick={isSelected ? undefined : handleDateClick}
        >
            <div className="absolute z-20 bg-[#ffe698] top-0 right-0 bottom-0 left-0 flex justify-center items-center">
                {formattedDay}
            </div>

            <div className="absolute top-1 left-1 -right-1 -bottom-1 bg-gradient-to-r from-[#e1017e] to-[#33bbe9] z-10" />
        </div>
    );
};

const ProgramDatesSelect = (): ReactElement => {

    const availableDates = getAvailableDates();

    return (
        <ContentWrapper>
            <div className="flex justify-between gap-7">
                {availableDates.map((availableDate, index) => (
                    <Date
                        // eslint-disable-next-line react/no-array-index-key
                        key={index}
                        date={availableDate}
                        dayIndex={index + 1}
                    />
                ))}
            </div>
        </ContentWrapper>
    );
};

export default ProgramDatesSelect;
