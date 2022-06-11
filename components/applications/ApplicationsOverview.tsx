import styles from './ApplicationsOverview.module.scss';

import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import type { ReactElement } from 'react';
import ApplicationOverviewList from 'components/applications/ApplicationOverviewList';
import ContentWrapper from 'components/common/ContentWrapper';
import useAllApplications from 'lib/applications/useAllApplications';

interface Props {
    applicationId: number | undefined;
}

const ApplicationsOverview = ({ applicationId }: Props): ReactElement => {

    const allApplications = useAllApplications();

    return (
        <div className={`bg-gray-500 py-5 min-h-screen ${styles.overview}`}>
            <ContentWrapper>
                {applicationId === undefined ? (
                    <div className="text-white text-3xl mb-1">
                        Übersicht aller Bewerbungen
                    </div>
                ) : (
                    <Link href="/bewerbung/uebersicht">
                        <a className="text-white text-md mb-1 space-x-2">
                            <FontAwesomeIcon icon={faChevronLeft} /> <span>zur Übersicht</span>
                        </a>
                    </Link>
                )}

                <ApplicationOverviewList
                    allApplications={allApplications}
                    applicationId={applicationId}
                />
            </ContentWrapper>
        </div>
    );
};

export default ApplicationsOverview;
