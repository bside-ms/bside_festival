import type { ReactElement } from 'react';
import Application from 'components/applications/applicationsOverview/Application';
import ApplicationOverviewAdditionalFilters from 'components/applications/applicationsOverview/ApplicationOverviewAdditionalFilters';
import { useApplicationsOverviewContext } from 'components/applications/applicationsOverview/ApplicationsOverviewContext';
import ApplicationsOverviewSearchTextFilter from 'components/applications/applicationsOverview/ApplicationsOverviewSearchTextFilter';
import ApplicationsOverviewTypesFilter from 'components/applications/applicationsOverview/ApplicationsOverviewTypesFilter';

const ApplicationsOverview = (): ReactElement => {
    const { allApplications, filteredApplications } = useApplicationsOverviewContext();

    const applicationAmount =
        filteredApplications.length === allApplications.length
            ? allApplications.length.toString()
            : `${filteredApplications.length} von ${allApplications.length}`;

    return (
        <div>
            <div className="text-3xl mb-5 font-display">Bewerbungen ({applicationAmount})</div>

            <ApplicationsOverviewSearchTextFilter />

            <ApplicationsOverviewTypesFilter />

            <ApplicationOverviewAdditionalFilters />

            <div className="grid grid-cols-1 gap-5">
                {filteredApplications.map((application) => (
                    <Application key={application.id} application={application} />
                ))}
            </div>
        </div>
    );
};

export default ApplicationsOverview;
