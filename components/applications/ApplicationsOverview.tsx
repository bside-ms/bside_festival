import styles from './ApplicationsOverview.module.scss';

import type { ReactElement } from 'react';
import ApplicationOverviewList from 'components/applications/ApplicationOverviewList';
import ContentWrapper from 'components/common/ContentWrapper';
import useAllApplications from 'lib/applications/useAllApplications';

const ApplicationsOverview = (): ReactElement => {

    const allApplications = useAllApplications();

    return (
        <div className={`bg-gray-500 py-5 min-h-screen ${styles.overview}`}>
            <ContentWrapper>
                <div className="text-white text-3xl mb-1">
                    Übersicht aller Bewerbungen
                </div>

                <ApplicationOverviewList allApplications={allApplications} />
            </ContentWrapper>
        </div>
    );
};

export default ApplicationsOverview;
