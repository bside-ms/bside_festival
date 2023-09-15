import type { ReactElement } from 'react';
import ParticipantsOverviewLDateRangeFilter from 'components/participants/overview/ParticipantsOverviewDateRangeFilter';
import ParticipantsOverviewLocationFilter from 'components/participants/overview/ParticipantsOverviewLocationFilter';

const ParticipantsOverviewAdditionalFilters = (): ReactElement => {
    return (
        <div className="mb-3">
            <div className="mt-4">
                <ParticipantsOverviewLocationFilter />
            </div>

            <div className="mt-8 empty:mt-0">
                <ParticipantsOverviewLDateRangeFilter />
            </div>
        </div>
    );
};

export default ParticipantsOverviewAdditionalFilters;
