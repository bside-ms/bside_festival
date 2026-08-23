'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useLayoutEffect, useRef } from 'react';

const HOME_PATH = '/';

const isHomePath = (pathname: string): boolean => pathname === HOME_PATH;

const setWindowScrollTop = (top: number): void => {
    const html = document.documentElement;
    const previousBehavior = html.style.scrollBehavior;
    html.style.scrollBehavior = 'auto';
    window.scrollTo({ left: 0, top, behavior: 'auto' });
    html.style.scrollBehavior = previousBehavior;
};

const HomeScrollRestoration = (): null => {
    const pathname = usePathname();
    const previousPathnameRef = useRef(pathname);
    const homeScrollRef = useRef(0);

    useEffect(() => {
        if (!isHomePath(pathname)) {
            return;
        }

        homeScrollRef.current = window.scrollY;
        const onScroll = () => {
            homeScrollRef.current = window.scrollY;
        };
        window.addEventListener('scroll', onScroll, { passive: true });

        return () => window.removeEventListener('scroll', onScroll);
    }, [pathname]);

    useEffect(() => {
        const originalScrollRestoration = window.history.scrollRestoration;
        window.history.scrollRestoration = 'manual';

        return () => {
            window.history.scrollRestoration = originalScrollRestoration;
        };
    }, []);

    useLayoutEffect(() => {
        const previousPathname = previousPathnameRef.current;
        previousPathnameRef.current = pathname;

        if (isHomePath(pathname) && !isHomePath(previousPathname)) {
            setWindowScrollTop(homeScrollRef.current);
        }
    }, [pathname]);

    return null;
};

export default HomeScrollRestoration;
