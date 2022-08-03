import { useSession } from 'next-auth/react';
import type { ReactElement } from 'react';
import ApplicationsOverviewNotAllowed from 'components/applications/ApplicationsOverviewNotAllowed';
import TimeTable from 'components/program/timeTable/TimeTable';
import SwrResponseWrapper from 'components/strapi/SwrResponseWrapper';
import isGroupMember from 'lib/next-auth/isGroupMember';
import type AllProgramItemsResponse from 'lib/strapi/typings/AllProgramItemsResponse';
import type Exhibition from 'lib/strapi/typings/Exhibition';
import type Food from 'lib/strapi/typings/Food';
import type InformationBooth from 'lib/strapi/typings/InformationBooth';
import useAllExhibitions from 'lib/strapi/useAllExhibitions';
import useAllFoods from 'lib/strapi/useAllFoods';
import useAllInformationBooths from 'lib/strapi/useAllInformationBooths';
import useAllProgramItems from 'lib/strapi/useAllProgramItems';

export default (): ReactElement => {

    const swrResponse = useAllProgramItems();
    const swrExhibitionsResponse = useAllExhibitions();
    const swrFoodsResponse = useAllFoods();
    const swrInformationBoothsResponse = useAllInformationBooths();

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
                        <SwrResponseWrapper<Array<Food>> response={swrFoodsResponse}>
                            {(foods): ReactElement => (
                                <SwrResponseWrapper<Array<InformationBooth>> response={swrInformationBoothsResponse}>
                                    {(informationBooths): ReactElement => (
                                        <SwrResponseWrapper<AllProgramItemsResponse> response={swrResponse}>
                                            {({ allProgramItems: { concerts, workshops, performances, readings, familyPrograms } }): ReactElement => (
                                                <TimeTable
                                                    concerts={concerts ?? []}
                                                    workshops={workshops ?? []}
                                                    performances={performances ?? []}
                                                    readings={readings ?? []}
                                                    familyPrograms={familyPrograms ?? []}
                                                    exhibitions={exhibitions}
                                                    foods={foods}
                                                    informationBooths={informationBooths}
                                                />
                                            )}
                                        </SwrResponseWrapper>
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
