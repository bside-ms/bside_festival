import styles from 'components/common/PageHeader.module.scss';

import { range } from 'lodash';
import Link from 'next/link';
import type { ReactElement } from 'react';
import BHeartSvg from 'components/common/BHeartSvg';
import ContentWrapper from 'components/common/ContentWrapper';

type HeaderThemes = 'blue' | 'yellow' | 'pink' | 'yellowOnPink';

interface Props {
    theme?: HeaderThemes;
    symbols?: 'plusSigns' | 'hearts';
}

const themeClasses: Record<HeaderThemes, string | undefined> = {
    blue: styles.blueTheme,
    yellow: styles.yellowTheme,
    pink: styles.pinkTheme,
    yellowOnPink: styles.yellowOnPink,
};

const Symbols = ({ symbols }: { symbols: NonNullable<Props['symbols']>}): ReactElement => {

    switch (symbols) {
        case 'plusSigns':
            return (
                <div className={styles.plusSigns}>
                    ++++
                    ++++
                    ++++
                    ++++
                </div>
            );

        case 'hearts': {
            const heart = <BHeartSvg size={22} color="" />;

            return (
                <div className={`w-2/3 md:w-[300px] ${styles.hearts ?? ''}`}>
                    {range(4).map((index) => (
                        <div key={index} className={styles.heartsRow}>
                            {heart}{heart}{heart}{heart}{heart}{heart}
                        </div>
                    ))}
                </div>
            );
        }
    }
};

const PageHeader = ({ theme = 'yellow', symbols = 'plusSigns' }: Props): ReactElement => {

    return (
        <div className={`${styles.headerContainer ?? ''} ${themeClasses[theme] ?? ''}`}>
            <ContentWrapper>
                <div className={styles.symbols}>
                    <Symbols symbols={symbols} />
                </div>
                <div className={styles.header}>
                    <Link href="/" passHref={true}>
                        <a className={styles.headerLink}>
                            <div className={`${styles.content ?? ''} font-display`}>
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
