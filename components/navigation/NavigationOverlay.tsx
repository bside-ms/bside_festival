import styles from './NavigationOverlay.module.scss';

import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { ReactElement } from 'react';
import ContentWrapper from 'components/common/ContentWrapper';
import { useNavigationOverlayContext } from 'components/navigation/NavigationOverlayContext';

const links = new Array<{label: string, link: string}>(
    { label: 'Start', link: '/' },
    { label: 'Mithelfen', link: '/mithelfen' },
    { label: 'Awareness', link: '/awareness' },
    // { label: 'Künstler:innen', link: '/kuenstler' },
    // { label: 'Orte', link: '/orte' },
);

const NavigationOverlay = (): ReactElement | null => {

    const { events } = useRouter();

    const { toggleOverlay, closeOverlay, isOverlayShown } = useNavigationOverlayContext();

    // Making sure overlay closes after link changed
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    events?.on('routeChangeComplete', () => closeOverlay());

    if (!isOverlayShown) {
        return null;
    }

    return (
        <div className="fixed top-0 right-0 bottom-0 left-0 z-[400]">
            <div className={`absolute top-0 right-0 bottom-0 left-0 ${styles.background ?? ''}`} />

            <ContentWrapper>
                <div className={styles.menuToggle}>
                    <div
                        className="w-11 h-11 text-[28px] leading-3 flex flex-col justify-center text-center cursor-pointer text-white bg-[#33bbe9]"
                        onClick={toggleOverlay}
                    >
                        <FontAwesomeIcon icon={faTimes} />
                    </div>
                </div>

                <div className="pt-36 flex flex-col space-y-4 text-4xl text-center">
                    {links.map(link => (
                        <div key={link.link}>
                            <Link href={link.link}>
                                <a className="font-display text-white">
                                    {link.label}
                                </a>
                            </Link>
                        </div>
                    ))}
                </div>
            </ContentWrapper>
        </div>
    );
};

export default NavigationOverlay;
