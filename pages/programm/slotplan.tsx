import { useSession } from 'next-auth/react';
import type { ReactElement } from 'react';
import ApplicationsOverviewNotAllowed from 'components/applications/ApplicationsOverviewNotAllowed';
import TimeTable from 'components/program/timeTable/TimeTable';
import SwrResponseWrapper from 'components/strapi/SwrResponseWrapper';
import useIsGroupMember from 'lib/next-auth/useIsGroupMember';
import type Concert from 'lib/strapi/Concert';
import useAllConcerts from 'lib/strapi/useAllConcerts';
import useAllWorkshops from 'lib/strapi/useAllWorkshops';
import type Workshop from 'lib/strapi/Workshop';

export default (): ReactElement => {

    const swrConcertsResponse = useAllConcerts();
    const swrWorkshopsResponse = useAllWorkshops();

    const { data: session, status } = useSession();
    const isInFestivalGroup = useIsGroupMember('/kreise/festival/mitglieder', session);

    if (status !== 'authenticated') {
        return <ApplicationsOverviewNotAllowed reason={status} />;
    }

    if (!isInFestivalGroup) {
        return <ApplicationsOverviewNotAllowed reason="notInFestival" />;
    }

    return (
        <div className="min-h-screen pt-8">
            <div className="w-full pl-5 mx-auto relative">
                <SwrResponseWrapper<Array<Concert>> response={swrConcertsResponse}>
                    {(concerts): ReactElement => (
                        <SwrResponseWrapper<Array<Workshop>> response={swrWorkshopsResponse}>
                            {(workshops): ReactElement => (
                                <TimeTable
                                    concerts={concerts}
                                    workshops={workshops}
                                />
                            )}
                        </SwrResponseWrapper>
                    )}
                </SwrResponseWrapper>
            </div>
        </div>
    );
};
