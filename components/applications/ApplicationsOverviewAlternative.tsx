import styles from './ApplicationsOverviewAlternative.module.scss';

import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { ReactElement } from 'react';
import ContentWrapper from 'components/common/ContentWrapper';
import LoginLink from 'components/common/LoginLink';

interface Props {
    sessionStatus: 'unauthenticated' | 'loading';
}

const ApplicationsOverviewAlternative = ({ sessionStatus }: Props): ReactElement => {

    return (
        <div className={`text-white bg-gray-500 py-5 text-2xl text-center h-screen ${styles.overview}`}>
            <ContentWrapper>
                {sessionStatus === 'unauthenticated' ? (
                    <>
                        <div>
                            <FontAwesomeIcon icon={faExclamationTriangle} />
                            {' '}
                            Hierfür ist ein Login erforderlich
                        </div>
                        <div className="mt">
                            <LoginLink />
                        </div>
                    </>
                ) : null}
            </ContentWrapper>
        </div>
    );
};

export default ApplicationsOverviewAlternative;
