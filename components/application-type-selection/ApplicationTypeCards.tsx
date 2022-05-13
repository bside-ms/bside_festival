import styles from './ApplicationTypeCards.module.scss';

import type { ReactElement } from 'react';
import ApplicationTypeCard from 'components/application-type-selection/ApplicationTypeCard';
import ApplicationType from 'lib/application-form/ApplicationType';

const ApplicationTypeCards = (): ReactElement => {

    return (
        <>
            <div className={`${styles.title} font-display`}>
                BEWERBUNG
            </div>

            <div className={styles.cardsContainer}>
                <div className={styles.cards}>
                    {Object.values(ApplicationType).map(applicationType => (
                        <ApplicationTypeCard
                            key={applicationType}
                            applicationType={applicationType}
                        />
                    ))}
                </div>
            </div>
        </>
    );
};

export default ApplicationTypeCards;
