'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useLayoutEffect, useRef } from 'react';

const LIST_PATH = '/programm';
const LIST_SCROLL_KEY = 'bside-program-list-scroll-y';
const detailPathPattern = /^\/programm\/\d+$/;

const isListPath = (pathname: string): boolean => pathname === LIST_PATH;
const isDetailPath = (pathname: string): boolean => detailPathPattern.test(pathname);

const setWindowScrollTop = (top: number): void => {
    const html = document.documentElement;
    const previousBehavior = html.style.scrollBehavior;
    html.style.scrollBehavior = 'auto';
    window.scrollTo({ left: 0, top, behavior: 'auto' });
    html.style.scrollBehavior = previousBehavior;
};

const ProgramScrollRestoration = (): null => {
    const pathname = usePathname();
    const previousPathnameRef = useRef(pathname);
    const listScrollRef = useRef(0);

    useEffect(() => {
        if (!isListPath(pathname)) {
            return;
        }

        listScrollRef.current = window.scrollY;
        const onScroll = () => {
            listScrollRef.current = window.scrollY;
        };
        window.addEventListener('scroll', onScroll, { passive: true });

        return () => window.removeEventListener('scroll', onScroll);
    }, [pathname]);

    useLayoutEffect(() => {
        const previousPathname = previousPathnameRef.current;
        previousPathnameRef.current = pathname;

        if (isDetailPath(pathname)) {
            if (isListPath(previousPathname)) {
                sessionStorage.setItem(LIST_SCROLL_KEY, String(listScrollRef.current));
            }

            setWindowScrollTop(0);
            return;
        }

        if (isListPath(pathname) && isDetailPath(previousPathname)) {
            const savedScrollY = sessionStorage.getItem(LIST_SCROLL_KEY);

            if (savedScrollY !== null) {
                setWindowScrollTop(Number(savedScrollY));
            }
        }
    }, [pathname]);

    return null;
};

export default ProgramScrollRestoration;
