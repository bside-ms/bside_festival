import styles from './PageHeader.module.scss';

import Link from 'next/link';
import type { ReactElement } from 'react';

interface Props {
    theme: 'blue' | 'yellow';
}

const themeClasses: Record<'blue' | 'yellow', string> = {
    blue: styles.blueTheme,
    yellow: styles.yellowTheme,
};

const PageHeader = ({ theme = 'yellow' }: Props): ReactElement => {

    return (
        <div className={`${styles.headerContainer} ${themeClasses[theme]}`}>
            <div className={styles.plusSigns}>
                ++++ ++++ ++++ ++++
            </div>
            <div className={styles.header}>
                <Link href="/" passHref={true}>
                    <a className={styles.headerLink}>
                        <div className={`${styles.content} font-display`}>
                            <div>B-SIDE</div>
                            <div>FESTIVAL</div>
                            <div>16. - 18. SEP</div>
                        </div>
                    </a>
                </Link>
            </div>
        </div>
    );
};

export default PageHeader;
