import styles from 'components/applications/ApplicationsOverviewAlternative.module.scss';

import { faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSession } from 'next-auth/react';
import type { ReactElement } from 'react';
import ContentWrapper from 'components/common/ContentWrapper';
import LoginLink from 'components/common/LoginLink';
import isGroupMember from 'lib/next-auth/isGroupMember';

interface Props {
    children: ReactElement;
}

const RestrictedAccess = ({ children }: Props): ReactElement | null => {
    const { data: session, status } = useSession();
    const isInFestivalGroup = isGroupMember('/kreise/festival/mitglieder', session);

    switch (status) {
        case 'loading':
            return null;

        case 'unauthenticated':
            return (
                <div className={`text-white bg-gray-500 py-5 text-2xl text-center h-screen ${styles.overview ?? ''}`}>
                    <ContentWrapper>
                        <div className="flex flex-col gap-5">
                            <FontAwesomeIcon icon={faLock} className="text-5xl" />
                            Hierfür ist ein Login erforderlich
                            <LoginLink />
                        </div>
                    </ContentWrapper>
                </div>
            );

        case 'authenticated':
            if (!isInFestivalGroup) {
                return (
                    <div className={`text-white bg-gray-500 py-5 text-2xl text-center h-screen ${styles.overview ?? ''}`}>
                        <ContentWrapper>
                            <div className="flex flex-col gap-5">
                                <FontAwesomeIcon icon={faLock} className="text-5xl" />
                                Hierfür musst du Mitglied
                                <br />
                                der Festival-Gruppe sein
                            </div>
                        </ContentWrapper>
                    </div>
                );
            }

            return children;
    }
};

export default RestrictedAccess;
