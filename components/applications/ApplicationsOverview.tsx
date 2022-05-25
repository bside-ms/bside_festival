import type { ReactElement } from 'react';
import Application from 'components/applications/Application';
import ContentWrapper from 'components/common/ContentWrapper';
import useAllApplications from 'lib/applications/useAllApplications';

const ApplicationsOverview = (): ReactElement => {

    const allApplications = useAllApplications();

    if (allApplications instanceof Error) {
        return (
            <ContentWrapper>
                {allApplications.toString()}
            </ContentWrapper>
        );
    }

    if (allApplications === null) {
        return (
            <ContentWrapper>
                Wird geladen...
            </ContentWrapper>
        );
    }

    return (
        <div className="bg-gray-500 py-5">
            <ContentWrapper>
                <div className="text-white text-3xl mb-1">
                    Übersicht aller Bewerbungen
                </div>

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
            </ContentWrapper>
        </div>
    );
};

export default ApplicationsOverview;
