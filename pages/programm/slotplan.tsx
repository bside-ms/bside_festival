import { useSession } from 'next-auth/react';
import type { ReactElement } from 'react';
import ApplicationsOverviewNotAllowed from 'components/applications/ApplicationsOverviewNotAllowed';
import TimeTable from 'components/program/timeTable/TimeTable';
import TimeTableContextWrapper from 'components/program/timeTable/TimeTableContextWrapper';
import SwrResponseWrapper from 'components/strapi/SwrResponseWrapper';
import isGroupMember from 'lib/next-auth/isGroupMember';
import type AllFullTimeProgramItemsResponse from 'lib/strapi/typings/AllFullTimeProgramItemsResponse';
import type AllProgramItemsResponse from 'lib/strapi/typings/AllProgramItemsResponse';
import useAllFullTimeProgramItems from 'lib/strapi/useAllFullTimeProgramItems';
import useAllProgramItems from 'lib/strapi/useAllProgramItems';

export default (): ReactElement => {

    const swrProgramItemsResponse = useAllProgramItems();
    const swrFullTimeProgramItemsResponse = useAllFullTimeProgramItems();

    const { data: session, status } = useSession();
    const isInFestivalGroup = isGroupMember('/kreise/festival/mitglieder', session);

    if (status !== 'authenticated') {
        return <ApplicationsOverviewNotAllowed reason={status} />;
    }

    if (!isInFestivalGroup) {
        return <ApplicationsOverviewNotAllowed reason="notInFestival" />;
    }

    return (
        <div className="min-h-screen pt-8">
            <div className="w-full pl-5 mx-auto relative">
                <TimeTableContextWrapper>
                    <SwrResponseWrapper<AllFullTimeProgramItemsResponse> response={swrFullTimeProgramItemsResponse}>
                        {({ allFullTimeProgramItems: { exhibitions, foods, informationBooths } }): ReactElement => (
                            <SwrResponseWrapper<AllProgramItemsResponse> response={swrProgramItemsResponse}>
                                {({ allProgramItems: { concerts, workshops, performances, readings, familyPrograms } }): ReactElement => (
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
                                )}
                            </SwrResponseWrapper>
                        )}
                    </SwrResponseWrapper>
                </TimeTableContextWrapper>
            </div>
        </div>
    );
};
