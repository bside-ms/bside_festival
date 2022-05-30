import styles from './ApplicationsOverviewAlternative.module.scss';

import { faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { ReactElement } from 'react';
import ContentWrapper from 'components/common/ContentWrapper';
import LoginLink from 'components/common/LoginLink';

interface Props {
    reason: 'loading' | 'unauthenticated' | 'notInFestival';
}

const ApplicationsOverviewNotAllowed = ({ reason }: Props): ReactElement => {

    const getContent = (): ReactElement | null => {
        switch (reason) {
            case 'loading':
                return null;

            case 'unauthenticated':
                return (
                    <div className="flex flex-col gap-5">
                        <FontAwesomeIcon icon={faLock} className="text-5xl" />
                        Hierfür ist ein Login erforderlich
                        <LoginLink />
                    </div>
                );

            case 'notInFestival':
                return (
                    <div className="flex flex-col gap-5">
                        <FontAwesomeIcon icon={faLock} className="text-5xl" />
                        Hierfür musst du Mitglied<br />
                        der Festival-Gruppe sein
                    </div>
                );
        }
    };

    return (
        <div className={`text-white bg-gray-500 py-5 text-2xl text-center h-screen ${styles.overview}`}>
            <ContentWrapper>
                {getContent()}
            </ContentWrapper>
        </div>
    );
};

export default ApplicationsOverviewNotAllowed;
