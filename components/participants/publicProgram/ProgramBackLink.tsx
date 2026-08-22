'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { MouseEvent, ReactElement } from 'react';
import { useCallback } from 'react';

export const programListVisitStorageKey = 'bside-program-list-visit';

const ProgramBackLink = (): ReactElement => {
    const router = useRouter();

    const handleClick = useCallback(
        (event: MouseEvent<HTMLAnchorElement>) => {
            const returnToList = sessionStorage.getItem(programListVisitStorageKey) === '1';

            if (!returnToList) {
                return;
            }

            event.preventDefault();
            router.back();
        },
        [router],
    );

    return (
        <Link
            href="/programm"
            onClick={handleClick}
            className="inline-flex font-bold no-underline hover:underline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-current"
        >
            ← Zum Programm
        </Link>
    );
};

export default ProgramBackLink;
