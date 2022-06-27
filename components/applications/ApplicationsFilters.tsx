import type { ReactElement } from 'react';
import ApplicationFilter from 'components/applications/ApplicationFilter';
import type ApplicationData from 'lib/application-form/ApplicationData';
import type ApplicationType from 'lib/application-form/ApplicationType';
import useAllApplicationTypes from 'lib/applications/useAllApplicationTypes';
import useApplicationTypesWithCounts from 'lib/applications/useApplicationTypesWithCounts';

interface Props {
    allApplications: Array<ApplicationData>;
    onFilterToggle: (applicationType: ApplicationType) => void;
    filteredApplicationTypes: Array<ApplicationType>;
}

const ApplicationsFilters = ({ allApplications, onFilterToggle, filteredApplicationTypes }: Props): ReactElement => {

    const allApplicationTypes = useAllApplicationTypes();
    const applicationTypesWithCounts = useApplicationTypesWithCounts(allApplications);

    return (
        <div className="flex flex-wrap text-xs gap-2 mb-4">
            {allApplicationTypes.map(applicationType => (
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
