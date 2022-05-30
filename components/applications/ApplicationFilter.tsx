import { useCallback } from 'react';
import type { ReactElement } from 'react';
import type ApplicationType from 'lib/application-form/ApplicationType';
import useApplicationTitle from 'lib/application-form/useApplicationTitle';
import useApplicationTypeColor from 'lib/applications/useApplicationTypeColor';

interface Props {
    applicationType: ApplicationType;
    applicationTypesWithCounts: Record<ApplicationType, number>;
    filteredApplicationTypes: Array<ApplicationType>;
    onClick: (applicationType: ApplicationType) => void;
}

const ApplicationFilter = ({ applicationType, applicationTypesWithCounts, filteredApplicationTypes, onClick }: Props): ReactElement => {

    const title = useApplicationTitle(applicationType);
    const color = useApplicationTypeColor(applicationType);

    const handleClick = useCallback(
        () => onClick(applicationType),
        [onClick, applicationType]
    );

    const isActivated = filteredApplicationTypes.includes(applicationType);
    const count = applicationTypesWithCounts[applicationType];

    const backgroundColor = isActivated ? color : `${color}50`;

    return (
        <div
            className="bg-white border-[1px] border-gray-700 rounded cursor-pointer drop-shadow-lg"
            onClick={handleClick}
        >
            <div
                style={{ backgroundColor }}
                className="py-1 px-2 rounded"
            >
                {title} ({count})
            </div>
        </div>
    );
};

export default ApplicationFilter;
