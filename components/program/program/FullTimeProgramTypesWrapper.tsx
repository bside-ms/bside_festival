import type { ReactElement } from 'react';
import FullTimeProgramTypeWrapper from 'components/program/program/FullTimeProgramTypeWrapper';
import type AllFullTimeProgramItems from 'lib/strapi/typings/AllFullTimeProgramItems';
import type FullTimeProgramItem from 'lib/strapi/typings/FullTimeProgramItem';

interface Props {
    allProgramItems: AllFullTimeProgramItems;
}

interface ProgramType {
    title: string;
    programItems: Array<FullTimeProgramItem> | null;
}

const FullTimeProgramTypesWrapper = ({ allProgramItems }: Props): ReactElement => {

    const programTypes = new Array<ProgramType>(
        { title: 'Ausstellungen', programItems: allProgramItems.exhibitions },
        { title: 'Infostände', programItems: allProgramItems.informationBooths },
        { title: 'Essensstände', programItems: allProgramItems.foods },
    );

    return (
        <div className="space-y-5">
            {programTypes.map(programType => (
                <FullTimeProgramTypeWrapper
                    key={programType.title}
                    title={programType.title}
                    programItems={programType.programItems}
                />
            ))}
        </div>
    );
};

export default FullTimeProgramTypesWrapper;
