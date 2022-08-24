import type { ReactElement } from 'react';
import ContentWrapper from 'components/common/ContentWrapper';
import { useProgramContext } from 'components/program/program/ProgramContext';
import ProgramItem from 'components/program/program/ProgramItem';
import ProgramItemWrapper from 'components/program/program/ProgramItemWrapper';
import ProgramTypeTitle from 'components/program/program/ProgramTypeTitle';
import useProgramItemFilteredByDate from 'lib/program/useProgramItemsFilteredByDate';
import type { default as ProgramItemModel } from 'lib/strapi/typings/ProgramItem';

interface Props {
    title: string;
    programItems: Array<ProgramItemModel> | null;
}

const ProgramTypeWrapper = ({ title, programItems }: Props): ReactElement | null => {

    const { programDate } = useProgramContext();

    const programItemsFilteredByDate = useProgramItemFilteredByDate(programItems ?? [], programDate);

    if (programItemsFilteredByDate.length === 0) {
        return null;
    }

    return (
        <div className="relative">
            <div className="sticky top-0 z-50">
                <ProgramTypeTitle title={title} />
            </div>

            <ContentWrapper>
                <div className="space-y-5 py-5">
                    {programItemsFilteredByDate.map(programItem => (
                        <ProgramItemWrapper
                            key={programItem.id}
                            programItem={programItem}
                        >
                            <ProgramItem programItem={programItem} />
                        </ProgramItemWrapper>
                    ))}
                </div>
            </ContentWrapper>
        </div>
    );
};

export default ProgramTypeWrapper;
