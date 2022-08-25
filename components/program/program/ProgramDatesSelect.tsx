import { useCallback } from 'react';
import { isSameDay } from 'date-fns';
import type { ReactElement } from 'react';
import ContentWrapper from 'components/common/ContentWrapper';
import { useProgramContext } from 'components/program/program/ProgramContext';
import ProgramDateSelect from 'components/program/program/ProgramDateSelect';
import getAvailableDates from 'lib/strapi/getAvailableDates';

const ProgramDatesSelect = (): ReactElement => {

    const { programDate, setProgramDay } = useProgramContext();

    const handleDateClick = useCallback((dayIndex: 1 | 2 | 3): void => {
        setProgramDay(dayIndex);
    }, [setProgramDay]);

    const availableDates = getAvailableDates();

    return (
        <ContentWrapper>
            <div className="flex justify-between gap-7">
                {availableDates.map((availableDate, index) => {

                    const dayIndex = index + 1 as 1 | 2 | 3;

                    return (
                        <ProgramDateSelect
                            key={dayIndex}
                            date={availableDate}
                            dayIndex={dayIndex}
                            onDayClick={handleDateClick}
                            isSelected={programDate !== null && isSameDay(availableDate[0], programDate[0])}
                        />
                    );
                })}
            </div>
        </ContentWrapper>
    );
};

export default ProgramDatesSelect;
