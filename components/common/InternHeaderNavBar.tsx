'use client';

import LoginButton from '@/components/common/LoginButton';
import LogoutLink from '@/components/common/LogoutLink';
import cn from '@/lib/common/helper/cn';
import { internPrimaryNavIds, isInternNavLinkActive, type InternNavLink } from '@/lib/intern/internNavLinks';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import type { ReactElement } from 'react';
import { useCallback, useEffect, useId, useState } from 'react';

interface Props {
    links: Array<InternNavLink>;
    userIdentifier: string | null;
}

const InternNavLinkItem = ({
    className,
    isActive,
    link,
    onNavigate,
}: {
    className?: string;
    isActive: boolean;
    link: InternNavLink;
    onNavigate?: () => void;
}): ReactElement => (
    <Link
        href={link.href}
        className={cn(
            'rounded-full px-2.5 py-1 text-xs whitespace-nowrap no-underline',
            isActive ? 'bg-white text-black' : 'text-white/80 hover:bg-white/10 hover:text-white',
            className,
        )}
        onClick={onNavigate}
    >
        {link.label}
    </Link>
);

const InternHeaderNavBar = ({ links, userIdentifier }: Props): ReactElement => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [mobileOpen, setMobileOpen] = useState(false);
    const menuId = useId();
    const primaryLinks = links.filter((link) => internPrimaryNavIds.includes(link.id));
    const moreLinks = links.filter((link) => !internPrimaryNavIds.includes(link.id));
    const isMoreActive = moreLinks.some((link) => isInternNavLinkActive(link, pathname, searchParams));

    useEffect(() => {
        setMobileOpen(false);
    }, [pathname, searchParams]);

    useEffect(() => {
        if (!mobileOpen) {
            return;
        }

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setMobileOpen(false);
            }
        };

        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [mobileOpen]);

    const closeMobileMenu = useCallback(() => setMobileOpen(false), []);
    const toggleMobileMenu = useCallback(() => setMobileOpen((open) => !open), []);

    if (userIdentifier === null) {
        return <LoginButton />;
    }

    return (
        <>
            <nav className="hidden min-w-0 items-center gap-1 md:flex" aria-label="Interne Navigation">
                {primaryLinks.map((link) => (
                    <InternNavLinkItem key={link.id} link={link} isActive={isInternNavLinkActive(link, pathname, searchParams)} />
                ))}
                {moreLinks.map((link) => (
                    <InternNavLinkItem
                        key={link.id}
                        className="hidden lg:inline"
                        link={link}
                        isActive={isInternNavLinkActive(link, pathname, searchParams)}
                    />
                ))}
                {moreLinks.length > 0 && (
                    <details className="relative lg:hidden">
                        <summary
                            className={cn(
                                'cursor-pointer list-none rounded-full px-2.5 py-1 text-xs [&::-webkit-details-marker]:hidden',
                                isMoreActive ? 'bg-white text-black' : 'text-white/80 hover:bg-white/10 hover:text-white',
                            )}
                        >
                            Mehr
                        </summary>
                        <div className="absolute top-full right-0 z-50 mt-1 min-w-52 rounded-xl border border-white/20 bg-black p-2 shadow-lg">
                            <div className="flex flex-col gap-1">
                                {moreLinks.map((link) => (
                                    <InternNavLinkItem
                                        key={link.id}
                                        link={link}
                                        isActive={isInternNavLinkActive(link, pathname, searchParams)}
                                    />
                                ))}
                            </div>
                        </div>
                    </details>
                )}
                <span className="ml-2 max-w-36 truncate text-xs text-white/50" title={userIdentifier}>
                    {userIdentifier}
                </span>
                <LogoutLink className="text-xs text-white/70 hover:text-white" />
            </nav>

            <div className="flex items-center gap-3 md:hidden">
                <button
                    type="button"
                    className="rounded-md border border-white/40 px-3 py-1.5 text-sm text-white"
                    aria-expanded={mobileOpen}
                    aria-controls={menuId}
                    onClick={toggleMobileMenu}
                >
                    Intern
                </button>
            </div>

            {mobileOpen ? (
                <div id={menuId} className="absolute top-15 right-0 left-0 z-50 border-t border-white/15 bg-black px-4 py-4 md:hidden">
                    <div className="mx-auto flex max-w-2xl flex-col gap-3">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-white/70">
                            <span>Angemeldet als {userIdentifier}</span>
                            <span aria-hidden={true}>·</span>
                            <LogoutLink className="text-white/70 hover:text-white" />
                        </div>
                        <div className="flex flex-col gap-2">
                            {links.map((link) => (
                                <InternNavLinkItem
                                    key={link.id}
                                    link={link}
                                    isActive={isInternNavLinkActive(link, pathname, searchParams)}
                                    onNavigate={closeMobileMenu}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
};

export default InternHeaderNavBar;
