import { differenceInMinutes } from 'date-fns';
import type { ReactElement } from 'react';
import useFormattedDate from 'lib/common/useFormattedDate';
import useScaledTimeTableMinutes from 'lib/strapi/useScaledTimeTableMinutes';

interface Props {
    optimizedTimeTableBegin: Date;
    hour: Date;
    withHourText: boolean;
}

const TimeTableHourDelimiter = ({ optimizedTimeTableBegin, hour, withHourText }: Props): ReactElement => {

    const diffInMinutesFromStartOfDay = useScaledTimeTableMinutes(differenceInMinutes(hour, optimizedTimeTableBegin));

    const formattedHour = useFormattedDate(hour, 'HH');

    return (
        <>
            {withHourText && (
                <div
                    className="absolute text-gray-500 drop-shadow text-xs"
                    style={{
                        height: '20px',
                        lineHeight: '20px',
                        top: `${diffInMinutesFromStartOfDay - 10}px`,
                        left: '-20px',
                    }}
                >
                    {formattedHour}
                </div>
            )}
            <div
                className="absolute bg-gray-300 w-full"
                style={{
                    height: '1px',
                    top: `${diffInMinutesFromStartOfDay}px`,
                }}
            />

        </>
    );
};

export default TimeTableHourDelimiter;
