import styles from 'components/common/PageHeader.module.scss';

import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { range } from 'lodash';
import Link from 'next/link';
import type { ReactElement } from 'react';
import BHeartSvg from 'components/common/BHeartSvg';
import ContentWrapper from 'components/common/ContentWrapper';
import NavigationOverlay from 'components/navigation/NavigationOverlay';
import { useNavigationOverlayContext } from 'components/navigation/NavigationOverlayContext';

type HeaderThemes = 'blue' | 'yellow' | 'pink' | 'yellowOnPink';

interface Props {
    theme?: HeaderThemes;
    symbols?: 'plusSigns' | 'hearts' | 'none';
}

const themeClasses: Record<HeaderThemes, string | undefined> = {
    blue: styles.blueTheme,
    yellow: styles.yellowTheme,
    pink: styles.pinkTheme,
    yellowOnPink: styles.yellowOnPink,
};

const Symbols = ({ symbols }: { symbols: NonNullable<Props['symbols']>}): ReactElement | null => {

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

        case 'none':
            return <div />;
    }
};

const PageHeader = ({ theme = 'yellow', symbols = 'plusSigns' }: Props): ReactElement => {

    const { toggleOverlay } = useNavigationOverlayContext();

    return (
        <>
            <NavigationOverlay />

            <div className={`${styles.headerContainer ?? ''} ${themeClasses[theme] ?? ''}`}>
                <ContentWrapper>
                    <div className={styles.symbols}>
                        <Symbols symbols={symbols} />
                    </div>

                    <div className={styles.header}>
                        <div className="flex gap-4">
                            <Link href="/" passHref={true}>
                                <a className={styles.headerLink}>
                                    <div className={`${styles.content ?? ''} font-display`}>
                                        <div>B-Side</div>
                                        <div>Festival</div>
                                        <div>16. - 18. Sep</div>
                                    </div>
                                </a>
                            </Link>

                            <div className="flex flex-col justify-center text-white">
                                <div
                                    className={`
                                        w-11
                                        h-11 
                                        text-[28px] 
                                        leading-3 
                                        flex 
                                        flex-col 
                                        justify-center 
                                        text-center 
                                        cursor-pointer 
                                        ${styles.menuToggle ?? ''}
                                    `}
                                    onClick={toggleOverlay}
                                >
                                    <FontAwesomeIcon icon={faBars} />
                                </div>
                            </div>
                        </div>
                    </div>
                </ContentWrapper>
            </div>
        </>
    );
};

export default PageHeader;
