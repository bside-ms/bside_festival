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

            {filteredApplications.length === 0 ? (
                <div className="mt-5 p-3 md:p-5 rounded-md shadow-lg text-gray-800 backdrop-blur-2xl font-bold">
                    {allApplications.length > 0
                        ? 'Bisher sind noch keine Bewerbungen eingegangen!'
                        : 'Zur aktuellen Filterung keine Bewerbungen gefunden!'}
                </div>
            ) : (
                <div className="space-y-5">
                    {filteredApplications.map((application) => (
                        <Application key={application.id} application={application} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ApplicationsOverview;
