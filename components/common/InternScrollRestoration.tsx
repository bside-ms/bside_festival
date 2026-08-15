'use client';

import { internShellScrollId } from '@/lib/intern/internShellScroll';
import { usePathname } from 'next/navigation';
import { useLayoutEffect, useRef } from 'react';

const LIST_PATH = '/intern';
const LIST_SCROLL_KEY = 'intern-list-scroll-y';
const detailPathPattern = /^\/intern\/\d+$/;

const isListPath = (pathname: string): boolean => pathname === LIST_PATH;
const isDetailPath = (pathname: string): boolean => detailPathPattern.test(pathname);

const getInternScrollElement = (): HTMLElement | null => document.getElementById(internShellScrollId);

const readInternScrollTop = (): number => getInternScrollElement()?.scrollTop ?? window.scrollY;

const setInternScrollTop = (top: number): void => {
    const element = getInternScrollElement();

    if (element !== null) {
        element.scrollTop = top;
        return;
    }

    window.scrollTo({ left: 0, top, behavior: 'auto' });
};

/** Detail: scroll top. List (from detail): restore previous intern-shell scroll. Other intern routes: top. */
const InternScrollRestoration = (): null => {
    const pathname = usePathname();
    const previousPathnameRef = useRef(pathname);

    useLayoutEffect(() => {
        const previousPathname = previousPathnameRef.current;
        previousPathnameRef.current = pathname;

        if (isDetailPath(pathname)) {
            if (isListPath(previousPathname)) {
                sessionStorage.setItem(LIST_SCROLL_KEY, String(readInternScrollTop()));
            }

            setInternScrollTop(0);
            return;
        }

        if (isListPath(pathname) && isDetailPath(previousPathname)) {
            const savedScrollY = sessionStorage.getItem(LIST_SCROLL_KEY);

            if (savedScrollY !== null) {
                setInternScrollTop(Number(savedScrollY));
                return;
            }
        }

        setInternScrollTop(0);
    }, [pathname]);

    return null;
};

export default InternScrollRestoration;
