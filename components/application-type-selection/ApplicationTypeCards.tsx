import styles from './ApplicationTypeCards.module.scss';

import type { ReactElement } from 'react';
import ApplicationTypeCard from 'components/application-type-selection/ApplicationTypeCard';
import ContentWrapper from 'components/ContentWrapper';
import ApplicationType from 'lib/application-form/ApplicationType';

const ApplicationTypeCards = (): ReactElement => {

    return (
        <>
            <div className={`${styles.title} font-display`}>
                Bewerbung
            </div>

            <div className={styles.cardsContainer}>
                <ContentWrapper>
                    <div className={styles.cards}>
                        {Object.values(ApplicationType).map(applicationType => (
                            <ApplicationTypeCard
                                key={applicationType}
                                applicationType={applicationType}
                            />
                        ))}
                    </div>
                </ContentWrapper>
            </div>
        </>
    );
};

export default ApplicationTypeCards;
