import styles from './NavigationOverlay.module.scss';

import { useEffect } from 'react';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import type { ReactElement } from 'react';
import ContentWrapper from 'components/common/ContentWrapper';
import { useNavigationOverlayContext } from 'components/navigation/NavigationOverlayContext';

const links = new Array<{label: string, link: string}>(
    { label: 'Start', link: '/' },
    { label: 'Mithelfen', link: '/mithelfen' },
    { label: 'Awareness', link: '/awareness' },
);

const internalLinks = new Array<{label: string, link: string}>(
    { label: 'Bewerbungsübersicht', link: '/bewerbung/uebersicht' },
    { label: 'Slotplan', link: '/programm/slotplan' },
    { label: 'Helfer:innen', link: '/mithelfen/uebersicht' },
    { label: 'Programm', link: '/programm' },
    { label: 'Künstler:innen', link: '/artists' },
    { label: 'Orte', link: '/orte' },
);

const NavigationOverlay = (): ReactElement | null => {

    const { events } = useRouter();

    const { status } = useSession();

    const { toggleOverlay, closeOverlay, isOverlayShown } = useNavigationOverlayContext();

    // Making sure overlay closes after link changed
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    events?.on('routeChangeComplete', () => closeOverlay());

    useEffect(() => {
        if (isOverlayShown) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

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

                {status === 'authenticated' && (
                    <div className="mt-14 flex flex-col justify-center space-y-1 text-2xl text-center">
                        <span className="text-white underline">
                            Interne Links
                        </span>

                        {internalLinks.map(link => (
                            <div key={link.link}>
                                <Link href={link.link}>
                                    <a className="font-display text-white">
                                        {link.label}
                                    </a>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </ContentWrapper>
        </div>
    );
};

export default NavigationOverlay;
