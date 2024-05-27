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

const links = new Array<{ label: string; link: string }>();

// links.push(
//     { label: 'Start', link: '/' },
//     { label: 'Programm', link: '/programm' },
//     { label: 'Orte', link: '/orte' },
// );

const internalLinks = new Array<{ label: string; link: string }>();

// internalLinks.push(
//     { label: 'Bewerbungsübersicht', link: '/bewerbung/uebersicht' },
//     { label: 'Slotplan', link: '/programm/slotplan' },
//     { label: 'Helfer:innen', link: '/mithelfen/uebersicht' },
//     { label: 'Anmeldungen', link: '/programm/anmeldungen' },
//     { label: 'Künstler:innen', link: '/artists' },
// );

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
        <div className="fixed inset-0 z-[4000]">
            <div className={`absolute inset-0 ${styles.background ?? ''}`} />

            <ContentWrapper>
                <div className={styles.menuToggle}>
                    <div
                        className="flex size-11 cursor-pointer flex-col justify-center bg-[#33bbe9] text-center text-[28px] leading-3 text-white"
                        onClick={toggleOverlay}
                    >
                        <FontAwesomeIcon icon={faTimes} />
                    </div>
                </div>

                <div className="flex flex-col space-y-4 pt-36 text-center text-4xl">
                    {links.map((link) => (
                        <div key={link.link}>
                            <Link href={link.link} className="font-display text-white">
                                {link.label}
                            </Link>
                        </div>
                    ))}
                </div>

                {status === 'authenticated' && internalLinks.length > 0 && (
                    <div className="mt-14 flex flex-col justify-center space-y-1 text-center text-2xl">
                        <span className="text-white underline">Interne Links</span>

                        {internalLinks.map((link) => (
                            <div key={link.link}>
                                <Link href={link.link} className="font-display text-white">
                                    {link.label}
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
