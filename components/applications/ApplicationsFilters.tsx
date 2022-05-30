import type { ReactElement } from 'react';
import ApplicationFilter from 'components/applications/ApplicationFilter';
import type ApplicationData from 'lib/application-form/ApplicationData';
import ApplicationType from 'lib/application-form/ApplicationType';
import useApplicationTypesWithCounts from 'lib/applications/useApplicationTypesWithCounts';

interface Props {
    allApplications: Array<ApplicationData>;
    onFilterToggle: (applicationType: ApplicationType) => void;
    filteredApplicationTypes: Array<ApplicationType>;
}

const ApplicationsFilters = ({ allApplications, onFilterToggle, filteredApplicationTypes }: Props): ReactElement => {

    const applicationTypes = Object.values(ApplicationType) as Array<ApplicationType>;
    const applicationTypesWithCounts = useApplicationTypesWithCounts(allApplications);

    return (
        <div className="flex flex-wrap text-xs gap-2 mb-4">
            {applicationTypes.map(applicationType => (
                <ApplicationFilter
                    key={applicationType}
                    applicationType={applicationType}
                    applicationTypesWithCounts={applicationTypesWithCounts}
                    filteredApplicationTypes={filteredApplicationTypes}
                    onClick={onFilterToggle}
                />
            ))}
        </div>
    );
};

export default ApplicationsFilters;
