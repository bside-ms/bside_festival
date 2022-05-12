import styles from './ApplicationTypeCards.module.scss';

import type { ReactElement } from 'react';
import ApplicationTypeCard from 'components/application-type-selection/ApplicationTypeCard';
import ApplicationType from 'lib/application-form/ApplicationType';

const ApplicationTypeCards = (): ReactElement => {

    return (
        <div className={styles.container}>

            <div className={styles.title} />

            {Object.values(ApplicationType).map(applicationType => (
                <ApplicationTypeCard
                    key={applicationType}
                    applicationType={applicationType}
                />
            ))}
        </div>
    );
};

export default ApplicationTypeCards;
