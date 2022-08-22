import type { ReactElement } from 'react';
import SwrResponseWrapper from 'components/strapi/SwrResponseWrapper';
import VolunteersOverviewExplanation from 'components/volunteers/overview/VolunteersOverviewExplanation';
import VolunteersOverviewTable from 'components/volunteers/overview/VolunteersOverviewTable';
import { VolunteersOverviewTableContextProvider } from 'components/volunteers/overview/VolunteersOverviewTableContext';
import useAllVolunteers from 'lib/volunteers/useAllVolunteers';

const VolunteersOverview = (): ReactElement => {

    const allVolunteersResponse = useAllVolunteers();

    return (
        <div className="min-h-screen pt-[200px] pb-11 bg-[#ffe698]">
            <SwrResponseWrapper response={allVolunteersResponse}>
                {(allVolunteers): ReactElement => (
                    <>
                        <div className="text-xl font-bold m-3">
                            {allVolunteers.length} Helfer:innen
                        </div>

                        <VolunteersOverviewTableContextProvider>
                            <VolunteersOverviewTable allVolunteers={allVolunteers} />
                        </VolunteersOverviewTableContextProvider>

                        <VolunteersOverviewExplanation />
                    </>
                )}
            </SwrResponseWrapper>
        </div>
    );
};

export default VolunteersOverview;
