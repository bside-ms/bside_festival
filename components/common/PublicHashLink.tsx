'use client';

import { getPageHash, scrollToPageHash } from '@/lib/public/scrollToPageHash';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { type MouseEventHandler, type ReactElement, type ReactNode, useCallback } from 'react';

type Props = {
    children: ReactNode;
    className?: string;
    href: string;
};

const PublicHashLink = ({ children, className, href }: Props): ReactElement => {
    const hash = getPageHash(href);

    const handleClick = useCallback<MouseEventHandler<HTMLAnchorElement>>(
        (event) => {
            if (hash === undefined) {
                return;
            }

            if (!scrollToPageHash(hash)) {
                return;
            }

            event.preventDefault();
            if (window.location.hash !== `#${hash}`) {
                window.history.pushState(null, '', `/#${hash}`);
            }
        },
        [hash],
    );

    return (
        <Link href={href} scroll={hash === undefined} className={cn(className)} onClick={handleClick}>
            {children}
        </Link>
    );
};

export default PublicHashLink;
