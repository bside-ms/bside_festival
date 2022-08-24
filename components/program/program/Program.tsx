import type { ReactElement } from 'react';
import FullTimeProgramTypesWrapper from 'components/program/program/FullTimeProgramTypesWrapper';
import ProgramDatesSelect from 'components/program/program/ProgramDatesSelect';
import ProgramTypesWrapper from 'components/program/program/ProgramTypesWrapper';
import SwrResponseWrapper from 'components/strapi/SwrResponseWrapper';
import type AllFullTimeProgramItemsResponse from 'lib/strapi/typings/AllFullTimeProgramItemsResponse';
import type AllProgramItemsResponse from 'lib/strapi/typings/AllProgramItemsResponse';
import useAllFullTimeProgramItems from 'lib/strapi/useAllFullTimeProgramItems';
import useAllProgramItems from 'lib/strapi/useAllProgramItems';

const Program = (): ReactElement => {

    const swrProgramItemsResponse = useAllProgramItems();
    const swrFullTimeProgramItemsResponse = useAllFullTimeProgramItems();

    return (
        <div className="min-h-screen bg-black pt-[200px] pb-11">
            <ProgramDatesSelect />

            <div className="space-y-5 mt-7">
                <SwrResponseWrapper<AllProgramItemsResponse> response={swrProgramItemsResponse}>
                    {({ allProgramItems }): ReactElement => (
                        <ProgramTypesWrapper allProgramItems={allProgramItems} />
                    )}
                </SwrResponseWrapper>

                <SwrResponseWrapper<AllFullTimeProgramItemsResponse> response={swrFullTimeProgramItemsResponse}>
                    {({ allFullTimeProgramItems }): ReactElement => (
                        <FullTimeProgramTypesWrapper allProgramItems={allFullTimeProgramItems} />
                    )}
                </SwrResponseWrapper>
            </div>
        </div>
    );
};

export default Program;
