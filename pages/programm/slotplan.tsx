import { useSession } from 'next-auth/react';
import type { ReactElement } from 'react';
import ApplicationsOverviewNotAllowed from 'components/applications/ApplicationsOverviewNotAllowed';
import TimeTable from 'components/program/timeTable/TimeTable';
import SwrResponseWrapper from 'components/strapi/SwrResponseWrapper';
import isGroupMember from 'lib/next-auth/isGroupMember';
import type AllProgramItemsResponse from 'lib/strapi/typings/AllProgramItemsResponse';
import type Exhibition from 'lib/strapi/typings/Exhibition';
import useAllExhibitions from 'lib/strapi/useAllExhibitions';
import useAllProgramItems from 'lib/strapi/useAllProgramItems';

export default (): ReactElement => {

    const swrResponse = useAllProgramItems();
    const swrExhibitionsResponse = useAllExhibitions();

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
                <SwrResponseWrapper<Array<Exhibition>> response={swrExhibitionsResponse}>
                    {(exhibitions): ReactElement => (
                        <SwrResponseWrapper<AllProgramItemsResponse> response={swrResponse}>
                            {({ allProgramItems: { concerts, workshops, performances, readings, familyPrograms } }): ReactElement => (
                                <TimeTable
                                    concerts={concerts ?? []}
                                    workshops={workshops ?? []}
                                    performances={performances ?? []}
                                    readings={readings ?? []}
                                    familyPrograms={familyPrograms ?? []}
                                    exhibitions={exhibitions}
                                />
                            )}
                        </SwrResponseWrapper>
                    )}
                </SwrResponseWrapper>
            </div>
        </div>
    );
};
