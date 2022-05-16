import styles from 'components/PageHeader.module.scss';

import Link from 'next/link';
import type { ReactElement } from 'react';
import ContentWrapper from 'components/ContentWrapper';

type HeaderThemes = 'blue' | 'yellow' | 'pink';

interface Props {
    theme: HeaderThemes;
}

const themeClasses: Record<HeaderThemes, string> = {
    blue: styles.blueTheme,
    yellow: styles.yellowTheme,
    pink: styles.pinkTheme,
};

const PageHeader = ({ theme = 'yellow' }: Props): ReactElement => {

    return (
        <div className={`${styles.headerContainer} ${themeClasses[theme]}`}>
            <ContentWrapper>
                <div className={styles.plusSigns}>
                    ++++ ++++ ++++ ++++
                </div>
                <div className={styles.header}>
                    <Link href="/" passHref={true}>
                        <a className={styles.headerLink}>
                            <div className={`${styles.content} font-display`}>
                                <div>B-Side</div>
                                <div>Festival</div>
                                <div>16. - 18. Sep</div>
                            </div>
                        </a>
                    </Link>
                </div>
            </ContentWrapper>
        </div>
    );
};

export default PageHeader;
