import type { ReactElement } from 'react';
import FullTimeProgramTypesWrapper from 'components/program/program/FullTimeProgramTypesWrapper';
import ProgramDatesSelect from 'components/program/program/ProgramDatesSelect';
import ProgramItemPlaceholders from 'components/program/program/ProgramItemPlaceholders';
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
                <SwrResponseWrapper<AllProgramItemsResponse>
                    response={swrProgramItemsResponse}
                    loadingPlaceholder={<ProgramItemPlaceholders />}
                >
                    {({ allProgramItems }): ReactElement => (
                        <SwrResponseWrapper<AllFullTimeProgramItemsResponse>
                            response={swrFullTimeProgramItemsResponse}
                            loadingPlaceholder={<ProgramItemPlaceholders />}
                        >
                            {({ allFullTimeProgramItems }): ReactElement => (
                                <>
                                    <ProgramTypesWrapper allProgramItems={allProgramItems} />
                                    <FullTimeProgramTypesWrapper allProgramItems={allFullTimeProgramItems} />
                                </>
                            )}
                        </SwrResponseWrapper>
                    )}
                </SwrResponseWrapper>

            </div>
        </div>
    );
};

export default Program;
