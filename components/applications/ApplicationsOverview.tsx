import styles from './ApplicationsOverview.module.scss';

import type { ReactElement } from 'react';
import Application from 'components/applications/Application';
import ContentWrapper from 'components/common/ContentWrapper';
import type ApplicationData from 'lib/application-form/ApplicationData';
import useAllApplications from 'lib/applications/useAllApplications';

const Content = ({ allApplications }: { allApplications: Array<ApplicationData> | null | Error }): ReactElement => {

    if (allApplications instanceof Error) {
        return (
            <div className="text-white">
                Whoops, es gab einen Fehler..<br />
                {allApplications.toString()}
            </div>
        );
    }

    if (allApplications === null) {
        return (
            <div className="text-white">
                Wird geladen...
            </div>
        );
    }

    return (
        <>
            <div className="text-white mb-4">
                Anzahl: {allApplications.length}
            </div>

            <div className="space-y-3">
                {allApplications.map(application => (
                    <Application
                        key={application.id}
                        application={application}
                    />
                ))}
            </div>
        </>
    );
};

const ApplicationsOverview = (): ReactElement => {

    const allApplications = useAllApplications();

    return (
        <div className={`bg-gray-500 py-5 min-h-screen ${styles.overview}`}>
            <ContentWrapper>
                <div className="text-white text-3xl mb-1">
                    Übersicht aller Bewerbungen
                </div>

                <Content allApplications={allApplications} />
            </ContentWrapper>
        </div>
    );
};

export default ApplicationsOverview;
