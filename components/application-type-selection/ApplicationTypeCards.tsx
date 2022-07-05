import styles from './ApplicationTypeCards.module.scss';

import type { ReactElement } from 'react';
import ApplicationTypeCard from 'components/application-type-selection/ApplicationTypeCard';
import ContentWrapper from 'components/common/ContentWrapper';
import type ApplicationType from 'lib/application-form/ApplicationType';

interface Props {
    availableApplicationTypes: Array<ApplicationType>;
}

const ApplicationTypeCards = ({ availableApplicationTypes }: Props): ReactElement => {

    return (
        <>
            <div className={`${styles.title ?? ''} font-display`}>
                Bewerbung
            </div>

            <div className={styles.cardsContainer}>
                <ContentWrapper>
                    <div className="mb-6 w-5/6 m-auto text-center">
                        Auf dem B-Side Festival gibt es viele verschiedenen Formate. Damit wir den
                        Überblick behalten, haben wir auf dieser Seite verschiedene Bewerbungsformulare
                        zusammengestellt. Such dir einfach das Genre raus, das am ehesten zu
                        deinem Programmpunkt passt.
                    </div>

                    <div className={styles.cards}>
                        {availableApplicationTypes.map(applicationType => (
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
