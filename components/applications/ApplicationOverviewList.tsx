import { useCallback, useState } from 'react';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { ReactElement } from 'react';
import Application from 'components/applications/Application';
import ApplicationsFilters from 'components/applications/ApplicationsFilters';
import SingleApplication from 'components/applications/SingleApplication';
import type ApplicationData from 'lib/application-form/ApplicationData';
import type ApplicationType from 'lib/application-form/ApplicationType';

interface Props {
    allApplications: Array<ApplicationData> | null | Error;
    applicationId: number | undefined;
}

const ApplicationOverviewList = ({ allApplications, applicationId }: Props): ReactElement => {

    const [filteredApplicationTypes, setFilteredApplicationTypes] = useState<Array<ApplicationType>>([]);

    const handleFilterToggle = useCallback(
        (toggledApplicationType: ApplicationType) => {
            setFilteredApplicationTypes(prevState => {
                if (prevState.includes(toggledApplicationType)) {
                    return prevState.filter(type => type !== toggledApplicationType);
                } else {
                    return [...prevState, toggledApplicationType];
                }
            });
        },
        [setFilteredApplicationTypes]
    );

    if (allApplications instanceof Error) {
        return (
            <div className="text-white mt-4">
                Whoops, es gab einen Fehler..<br />
                {allApplications.toString()}
            </div>
        );
    }

    if (allApplications === null) {
        return (
            <div className="text-white mt-4">
                Wird geladen...
            </div>
        );
    }

    if (applicationId !== undefined) {

        const application = allApplications.find(applicationItem => applicationItem.id === applicationId);

        if (application === undefined) {
            return (
                <div className="text-white mt-4 text-xl">
                    <FontAwesomeIcon icon={faExclamationTriangle} /> Bewerbung nicht gefunden.
                </div>
            );
        }

        return (
            <div className="my-4">
                <SingleApplication application={application} />
            </div>
        );
    }

    const shownApplications = filteredApplicationTypes.length > 0
        ? allApplications.filter((application): boolean => (
            filteredApplicationTypes.includes(application.type)
        ))
        : allApplications;

    return (
        <>
            <div className="text-white mb-4">
                Anzahl: {allApplications.length}
            </div>

            <ApplicationsFilters
                allApplications={allApplications}
                onFilterToggle={handleFilterToggle}
                filteredApplicationTypes={filteredApplicationTypes}
            />

            <div className="space-y-3">
                {shownApplications.map(application => (
                    <Application
                        key={application.id}
                        application={application}
                    />
                ))}
            </div>
        </>
    );
};

export default ApplicationOverviewList;
