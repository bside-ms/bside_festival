import styles from './ApplicationTypeCard.module.scss';

import Link from 'next/link';
import type { ReactElement } from 'react';
import type ApplicationType from 'lib/application-form/ApplicationType';
import getTitleForApplicationType from 'lib/application-form/getTitleForApplicationType';
import useApplicationImage from 'lib/application-form/useApplicationImage';

interface Props {
    applicationType: ApplicationType;
}

const ApplicationTypeCard = ({ applicationType }: Props): ReactElement => {

    const title = getTitleForApplicationType(applicationType);
    const imageUrl = useApplicationImage(applicationType);

    return (
        <div className={styles.container}>
            <div className={styles.shadow} />
            <Link href={`/bewerbung/${applicationType}`} passHref={true}>
                <a>
                    <div className={styles.card} style={{ backgroundImage: `url(${imageUrl})` }}>
                        <div className={styles.contents}>
                            {title}
                        </div>
                    </div>
                </a>
            </Link>
        </div>
    );
};

export default ApplicationTypeCard;
