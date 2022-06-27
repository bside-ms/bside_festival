import styles from './ApplicationTypeCards.module.scss';

import { isFuture } from 'date-fns';
import type { ReactElement } from 'react';
import ApplicationTypeCard from 'components/application-type-selection/ApplicationTypeCard';
import ContentWrapper from 'components/common/ContentWrapper';
import useApplicationEndDate from 'lib/application-form/useApplicationEndDate';
import useAllApplicationTypes from 'lib/applications/useAllApplicationTypes';

const ApplicationTypeCards = (): ReactElement => {

    const availableApplicationTypes = useAllApplicationTypes().filter(
        applicationType => {

            // It's safe because we don't actually use any React hooks in there
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const endDate = useApplicationEndDate(applicationType);

            return isFuture(endDate);
        }
    );

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
