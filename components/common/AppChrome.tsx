'use client';

import PageHeader from '@/components/common/PageHeader';
import cn from '@/lib/common/helper/cn';
import { usePathname } from 'next/navigation';
import type { ReactElement, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    footer: ReactNode;
    internNav: ReactNode;
}

const AppChrome = ({ children, footer, internNav }: Props): ReactElement => {
    const isIntern = usePathname().startsWith('/intern');

    return (
        <div className={cn('flex flex-col', isIntern ? 'h-dvh overflow-hidden' : 'min-h-screen')}>
            <PageHeader fullWidth={isIntern} nav={isIntern ? internNav : undefined} />
            <div className={cn('gradient-background', isIntern ? 'flex min-h-0 flex-1 flex-col overflow-y-auto' : 'f26-background')}>
                {children}
            </div>
            {!isIntern && (
                <>
                    <div className="grow" />
                    {footer}
                </>
            )}
        </div>
    );
};

export default AppChrome;
