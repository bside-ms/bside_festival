import type { ReactElement } from 'react';
import ContentWrapper from 'components/common/ContentWrapper';
import FullTimeProgramItem from 'components/program/program/FullTimeProgramItem';
import { useProgramContext } from 'components/program/program/ProgramContext';
import ProgramItemWrapper from 'components/program/program/ProgramItemWrapper';
import ProgramTypeTitle from 'components/program/program/ProgramTypeTitle';
import useFullTimeProgramItemsFilteredByDate from 'lib/program/useFullTimeProgramItemsFilteredByDate';
import type { default as FullTimeProgramItemModel } from 'lib/strapi/typings/FullTimeProgramItem';

interface Props {
    title: string;
    programItems: Array<FullTimeProgramItemModel> | null;
}

const FullTimeProgramTypeWrapper = ({ title, programItems }: Props): ReactElement | null => {

    const { programDate } = useProgramContext();

    const programItemsFilteredByDate = useFullTimeProgramItemsFilteredByDate(programItems ?? [], programDate);

    if (programItemsFilteredByDate.length === 0) {
        return null;
    }

    return (
        <div>
            <ProgramTypeTitle title={title} />

            <ContentWrapper>
                <div className="space-y-5 py-5">
                    {programItemsFilteredByDate.map(programItem => (
                        <ProgramItemWrapper
                            key={programItem.id}
                            programItem={programItem}
                        >
                            <FullTimeProgramItem programItem={programItem} />
                        </ProgramItemWrapper>
                    ))}
                </div>
            </ContentWrapper>
        </div>
    );
};

export default FullTimeProgramTypeWrapper;
