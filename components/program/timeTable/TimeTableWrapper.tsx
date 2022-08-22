import type { ReactElement } from 'react';
import TimeTable from 'components/program/timeTable/TimeTable';
import SwrResponseWrapper from 'components/strapi/SwrResponseWrapper';
import { LocationGroupsContextProvider } from 'lib/context/LocationGroupsContext';
import { ProgramItemTypeFiltersContextProvider } from 'lib/context/ProgramItemTypeFiltersContext';
import type AllFullTimeProgramItemsResponse from 'lib/strapi/typings/AllFullTimeProgramItemsResponse';
import type AllProgramItemsResponse from 'lib/strapi/typings/AllProgramItemsResponse';
import type LocationGroup from 'lib/strapi/typings/LocationGroup';
import useAllFullTimeProgramItems from 'lib/strapi/useAllFullTimeProgramItems';
import useAllLocationGroups from 'lib/strapi/useAllLocationGroups';
import useAllProgramItems from 'lib/strapi/useAllProgramItems';

const TimeTableWrapper = (): ReactElement => {

    const swrProgramItemsResponse = useAllProgramItems();
    const swrFullTimeProgramItemsResponse = useAllFullTimeProgramItems();
    const swrAllLocationGroupsResponse = useAllLocationGroups();

    return (
        <SwrResponseWrapper<Array<LocationGroup>> response={swrAllLocationGroupsResponse}>
            {(allLocationGroups): ReactElement => (
                <LocationGroupsContextProvider locationGroups={allLocationGroups}>
                    <SwrResponseWrapper<AllFullTimeProgramItemsResponse> response={swrFullTimeProgramItemsResponse}>
                        {({ allFullTimeProgramItems: { exhibitions, foods, informationBooths } }): ReactElement => (
                            <SwrResponseWrapper<AllProgramItemsResponse> response={swrProgramItemsResponse}>
                                {({ allProgramItems: { concerts, workshops, performances, readings, familyPrograms } }): ReactElement => (
                                    <ProgramItemTypeFiltersContextProvider>
                                        <TimeTable
                                            concerts={concerts ?? []}
                                            workshops={workshops ?? []}
                                            performances={performances ?? []}
                                            readings={readings ?? []}
                                            familyPrograms={familyPrograms ?? []}
                                            exhibitions={exhibitions ?? []}
                                            foods={foods ?? []}
                                            informationBooths={informationBooths ?? []}
                                        />
                                    </ProgramItemTypeFiltersContextProvider>
                                )}
                            </SwrResponseWrapper>
                        )}
                    </SwrResponseWrapper>
                </LocationGroupsContextProvider>
            )}
        </SwrResponseWrapper>
    );
};

export default TimeTableWrapper;
