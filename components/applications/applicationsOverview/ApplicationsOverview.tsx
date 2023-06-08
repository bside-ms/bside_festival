import type { ReactElement } from 'react';
import Application from 'components/applications/applicationsOverview/Application';
import { useApplicationsOverviewContext } from 'components/applications/applicationsOverview/ApplicationsOverviewContext';
import ApplicationsOverviewSearchText from 'components/applications/applicationsOverview/ApplicationsOverviewSearchText';
import ApplicationsOverviewTypes from 'components/applications/applicationsOverview/ApplicationsOverviewTypes';

const ApplicationsOverview = (): ReactElement => {

    const { allApplications, filteredApplications } = useApplicationsOverviewContext();

    const applicationAmount = filteredApplications.length === allApplications.length
        ? allApplications.length.toString()
        : `${filteredApplications.length} von ${allApplications.length}`;

    return (
        <div>
            <div className="text-xl mb-2">
                Bewerbungen ({applicationAmount})
            </div>

            <ApplicationsOverviewSearchText />

            <ApplicationsOverviewTypes />

            <div className="grid grid-cols-1 gap-4">
                {filteredApplications
                    .map(application => (
                        <Application
                            key={application.id}
                            application={application}
                        />
                    ))}
            </div>
        </div>
    );
};

export default ApplicationsOverview;
