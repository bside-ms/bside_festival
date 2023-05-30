import type { ReactElement } from 'react';
import Application from 'components/applications/applicationsOverview/Application';
import { useApplicationsOverviewContext } from 'components/applications/applicationsOverview/ApplicationsOverviewContext';
import ApplicationsOverviewSearchText from 'components/applications/applicationsOverview/ApplicationsOverviewSearchText';
import ApplicationsOverviewTypes from 'components/applications/applicationsOverview/ApplicationsOverviewTypes';

const ApplicationsOverview = (): ReactElement => {

    const { filteredApplications } = useApplicationsOverviewContext();

    return (
        <div>
            <div className="text-xl mb-2">Bewerbungen</div>

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
