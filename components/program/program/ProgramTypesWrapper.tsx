import { useEffect } from 'react';
import { useRouterScroll } from '@moxy/next-router-scroll';
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
        { title: 'Konzerte', programItems: allProgramItems.concerts },
        { title: 'Workshops', programItems: allProgramItems.workshops },
        { title: 'Lesungen', programItems: allProgramItems.readings },
        { title: 'Performances, Theater & Kabarett', programItems: allProgramItems.performances },
        { title: 'Familienprogramm', programItems: allProgramItems.familyPrograms },
    );

    const { updateScroll } = useRouterScroll();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => updateScroll(), []);

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
