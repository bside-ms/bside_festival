import type { ReactElement } from 'react';
import ProgramTypeWrapper from 'components/program/program/ProgramTypeWrapper';
import type AllProgramItems from 'lib/strapi/typings/AllProgramItems';
import type ProgramItem from 'lib/strapi/typings/ProgramItem';

interface Props {
    allProgramItems: AllProgramItems;
}

interface ProgramType {
    title: string;
    programItems: Array<ProgramItem> | null;
}

const ProgramTypesWrapper = ({ allProgramItems }: Props): ReactElement => {

    const programTypes = new Array<ProgramType>(
        { title: 'Musik', programItems: allProgramItems.concerts },
        { title: 'Workshops', programItems: allProgramItems.workshops },
        { title: 'Lesungen', programItems: allProgramItems.readings },
        { title: 'Performances, Theater & Kabarett', programItems: allProgramItems.performances },
        { title: 'Familienprogramm', programItems: allProgramItems.familyPrograms },
    );

    return (
        <div className="space-y-5">
            {programTypes.map(programType => (
                <ProgramTypeWrapper
                    key={programType.title}
                    title={programType.title}
                    programItems={programType.programItems}
                />
            ))}
        </div>
    );
};

export default ProgramTypesWrapper;
