'use client';

import { getProgrammNavLink, getPublicNavGroups, type PublicNavGroup, type PublicNavLink } from '@/lib/public/publicNav';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type MouseEventHandler, type ReactElement, useCallback, useEffect, useId, useState } from 'react';
import { FaInstagram } from 'react-icons/fa';

const NavLinkItem = ({
    link,
    className,
    onNavigate,
}: {
    link: PublicNavLink;
    className?: string;
    onNavigate?: MouseEventHandler<HTMLAnchorElement>;
}): ReactElement => {
    return (
        <Link href={link.href} className={cn('text-white no-underline hover:text-rose-300', className)} onClick={onNavigate}>
            {link.label}
        </Link>
    );
};

const DesktopNavGroup = ({
    group,
    isOpen,
    onOpen,
    onClose,
    onToggle,
}: {
    group: PublicNavGroup;
    isOpen: boolean;
    onOpen: (groupId: string) => void;
    onClose: () => void;
    onToggle: (groupId: string) => void;
}): ReactElement => {
    const handleMouseEnter = useCallback(() => onOpen(group.id), [group.id, onOpen]);
    const handleToggle = useCallback(() => onToggle(group.id), [group.id, onToggle]);

    return (
        <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={onClose}>
            <button
                type="button"
                className="rounded-full px-3 py-2 font-display text-sm text-white hover:bg-white/10"
                aria-expanded={isOpen}
                onClick={handleToggle}
            >
                {group.label}
            </button>
            {isOpen ? (
                <div className="absolute top-full left-0 z-50 min-w-44 rounded-xl border border-white/20 bg-black px-3 py-2 shadow-lg">
                    <ul className="space-y-1">
                        {group.links.map((link) => (
                            <li key={link.id}>
                                <NavLinkItem link={link} className="block rounded-lg px-2 py-1.5 text-sm" />
                            </li>
                        ))}
                    </ul>
                </div>
            ) : null}
        </div>
    );
};

const MobileNavGroup = ({
    group,
    onNavigate,
}: {
    group: PublicNavGroup;
    onNavigate: MouseEventHandler<HTMLAnchorElement>;
}): ReactElement => {
    return (
        <div>
            <div className="mb-2 font-display text-xs tracking-wide text-white/50 uppercase">{group.label}</div>
            <ul className="space-y-2">
                {group.links.map((link) => (
                    <li key={link.id}>
                        <NavLinkItem link={link} className="block font-display text-lg" onNavigate={onNavigate} />
                    </li>
                ))}
            </ul>
        </div>
    );
};

const PublicNav = (): ReactElement => {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [openGroupId, setOpenGroupId] = useState<string | null>(null);
    const menuId = useId();
    const groups = getPublicNavGroups();
    const programmCta = getProgrammNavLink();

    useEffect(() => {
        setMobileOpen(false);
        setOpenGroupId(null);
    }, [pathname]);

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

    const openGroup = useCallback((groupId: string) => setOpenGroupId(groupId), []);
    const closeGroup = useCallback(() => setOpenGroupId(null), []);
    const toggleGroup = useCallback((groupId: string) => {
        setOpenGroupId((current) => (current === groupId ? null : groupId));
    }, []);
    const toggleMobileMenu = useCallback(() => setMobileOpen((open) => !open), []);
    const closeMobileMenu = useCallback(() => setMobileOpen(false), []);

    return (
        <>
            <nav className="hidden items-center gap-1 lg:flex" aria-label="Hauptnavigation">
                {groups.map((group) => (
                    <DesktopNavGroup
                        key={group.id}
                        group={group}
                        isOpen={openGroupId === group.id}
                        onOpen={openGroup}
                        onClose={closeGroup}
                        onToggle={toggleGroup}
                    />
                ))}

                {programmCta ? (
                    <Link
                        href={programmCta.href}
                        className="ml-2 rounded-full border border-white px-4 py-2 font-display text-sm font-bold text-white no-underline hover:bg-white hover:text-black"
                    >
                        {programmCta.label}
                    </Link>
                ) : null}

                <Link
                    href="https://www.instagram.com/bside.festival.ms/"
                    target="_blank"
                    rel="me"
                    className="ml-2 text-xl text-white hover:text-rose-300"
                    aria-label="Instagram"
                >
                    <FaInstagram />
                </Link>
            </nav>

            <div className="flex items-center gap-3 lg:hidden">
                <Link
                    href="https://www.instagram.com/bside.festival.ms/"
                    target="_blank"
                    rel="me"
                    className="text-xl text-white hover:text-rose-300"
                    aria-label="Instagram"
                >
                    <FaInstagram />
                </Link>
                <button
                    type="button"
                    className="rounded-md border border-white/40 px-3 py-1.5 font-display text-sm text-white"
                    aria-expanded={mobileOpen}
                    aria-controls={menuId}
                    onClick={toggleMobileMenu}
                >
                    Menü
                </button>
            </div>

            {mobileOpen ? (
                <div id={menuId} className="absolute top-15 right-0 left-0 z-50 border-t border-white/15 bg-black px-4 py-4 lg:hidden">
                    <div className="mx-auto flex max-w-2xl flex-col gap-4">
                        {groups.map((group) => (
                            <MobileNavGroup key={group.id} group={group} onNavigate={closeMobileMenu} />
                        ))}

                        {programmCta ? (
                            <Link
                                href={programmCta.href}
                                className="rounded-full border border-white px-4 py-2 text-center font-display font-bold text-white no-underline"
                                onClick={closeMobileMenu}
                            >
                                {programmCta.label}
                            </Link>
                        ) : null}
                    </div>
                </div>
            ) : null}
        </>
    );
};

export default PublicNav;
