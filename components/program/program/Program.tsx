import type { ReactElement } from 'react';
import ArtistModal from 'components/program/program/ArtistModal';
import EmptyProgramHint from 'components/program/program/EmptyProgramHint';
import FullTimeProgramTypesWrapper from 'components/program/program/FullTimeProgramTypesWrapper';
import GrowingProgramHint from 'components/program/program/GrowingProgramHint';
import ProgramDatesSelect from 'components/program/program/ProgramDatesSelect';
import ProgramItemPlaceholders from 'components/program/program/ProgramItemPlaceholders';
import ProgramTypesWrapper from 'components/program/program/ProgramTypesWrapper';
import SwrResponseWrapper from 'components/strapi/SwrResponseWrapper';
import { LocationGroupsContextProvider } from 'lib/context/LocationGroupsContext';
import type AllFullTimeProgramItemsResponse from 'lib/strapi/typings/AllFullTimeProgramItemsResponse';
import type AllProgramItemsResponse from 'lib/strapi/typings/AllProgramItemsResponse';
import useAllFullTimeProgramItems from 'lib/strapi/useAllFullTimeProgramItems';
import useAllLocationGroups from 'lib/strapi/useAllLocationGroups';
import useAllProgramItems from 'lib/strapi/useAllProgramItems';

const Program = (): ReactElement => {

    const swrProgramItemsResponse = useAllProgramItems();
    const swrFullTimeProgramItemsResponse = useAllFullTimeProgramItems();
    const swrAllLocationGroupsResponse = useAllLocationGroups();

    return (
        <div className="bg-black pt-[200px] pb-11">

            <ProgramDatesSelect />

            <div className="space-y-5 mt-7">
                <SwrResponseWrapper
                    response={swrAllLocationGroupsResponse}
                    loadingPlaceholder={<ProgramItemPlaceholders />}
                >
                    {(allLocationGroups): ReactElement => (
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
                                        <LocationGroupsContextProvider locationGroups={allLocationGroups}>
                                            <ArtistModal />
                                            <EmptyProgramHint
                                                allProgramItems={allProgramItems}
                                                allFullTimeProgramItems={allFullTimeProgramItems}
                                            />
                                            <ProgramTypesWrapper allProgramItems={allProgramItems} />
                                            <FullTimeProgramTypesWrapper allProgramItems={allFullTimeProgramItems} />
                                            <GrowingProgramHint
                                                allProgramItems={allProgramItems}
                                                allFullTimeProgramItems={allFullTimeProgramItems}
                                            />
                                        </LocationGroupsContextProvider>
                                    )}
                                </SwrResponseWrapper>
                            )}
                        </SwrResponseWrapper>
                    )}
                </SwrResponseWrapper>
            </div>
        </div>
    );
};

export default Program;
