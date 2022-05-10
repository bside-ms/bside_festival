import styles from './FrontPageHeader.module.scss';

import type { ReactElement } from 'react';

const FrontPageHeader = (): ReactElement => {

    return (
        <div className={styles.headerContainer}>
            <div className={styles.header}>
                <div className={styles.content}>
                    <div>B-SIDE</div>
                    <div>FESTIVAL</div>
                    <div>16. - 18. SEP</div>
                </div>
            </div>
        </div>
    );
};

export default FrontPageHeader;
