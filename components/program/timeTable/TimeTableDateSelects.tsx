import { isSameDay } from 'date-fns';
import type { ReactElement } from 'react';
import TimeTableDateSelect from 'components/program/timeTable/TimeTableDateSelect';
import useAvailableDates from 'lib/strapi/useAvailableDates';

interface Props {
    date: Date;
    handleDateChange: (date: Date) => void;
}

const TimeTableDateSelects = ({ date: selectedDate, handleDateChange }: Props): ReactElement => {

    const availableDates = useAvailableDates();

    return (
        <div className="flex gap-2">
            {availableDates.map(date => (
                <TimeTableDateSelect
                    key={date.toString()}
                    date={date}
                    handleDateChange={handleDateChange}
                    isSelected={isSameDay(date, selectedDate)}
                />
            ))}
        </div>
    );
};

export default TimeTableDateSelects;
