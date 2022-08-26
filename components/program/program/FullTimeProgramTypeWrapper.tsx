import type { ReactElement } from 'react';
import ContentWrapper from 'components/common/ContentWrapper';
import FullTimeProgramItem from 'components/program/program/FullTimeProgramItem';
import ProgramItemWrapper from 'components/program/program/ProgramItemWrapper';
import ProgramTypeTitle from 'components/program/program/ProgramTypeTitle';
import useFullTimeProgramItemFilteredByDateFunction from 'lib/program/useFullTimeProgramItemFilteredByDateFunction';
import type { default as FullTimeProgramItemModel } from 'lib/strapi/typings/FullTimeProgramItem';

interface Props {
    title: string;
    programItems: Array<FullTimeProgramItemModel> | null;
}

const FullTimeProgramTypeWrapper = ({ title, programItems }: Props): ReactElement | null => {

    const fullTimeProgramItemFilteredByDateFunction = useFullTimeProgramItemFilteredByDateFunction();

    if (programItems === null) {
        return null;
    }

    const programItemsFilteredByDate = programItems.filter(programItem => fullTimeProgramItemFilteredByDateFunction(programItem));

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
