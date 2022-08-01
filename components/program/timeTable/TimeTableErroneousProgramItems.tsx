import type { ReactElement } from 'react';
import TimeTableErroneousProgramItem from 'components/program/timeTable/TimeTableErroneousProgramItem';
import type ErroneousProgramItem from 'lib/strapi/typings/ErroneousProgramItem';

interface Props {
    erroneousProgramItems: Array<ErroneousProgramItem>;
}

const TimeTableErroneousProgramItems = ({ erroneousProgramItems }: Props): ReactElement => {

    return (
        <div className="bg-red-100 rounded p-3 my-7">
            <h3 className="text-xl mb-3">Folgende Programmpunkte können nicht dargestellt werden</h3>
            {erroneousProgramItems.map(programItem => (
                <TimeTableErroneousProgramItem
                    key={programItem.programItem.id}
                    erroneousProgramItem={programItem}
                />
            ))}
        </div>
    );
};

export default TimeTableErroneousProgramItems;
