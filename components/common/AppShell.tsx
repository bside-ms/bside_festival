'use client';

import PageHeader from '@/components/common/PageHeader';
import PublicNav from '@/components/common/PublicNav';
import cn from '@/lib/common/helper/cn';
import { internShellScrollId } from '@/lib/intern/internShellScroll';
import { usePathname } from 'next/navigation';
import type { ReactElement, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    footer: ReactNode;
    internNav: ReactNode;
}

const AppShell = ({ children, footer, internNav }: Props): ReactElement => {
    const pathname = usePathname();
    const isIntern = pathname.startsWith('/intern');
    const isAwareness = pathname.startsWith('/awareness');

    return (
        <div className={cn('flex flex-col', isIntern ? 'h-dvh overflow-hidden' : 'min-h-screen')}>
            <PageHeader fullWidth={isIntern} nav={isIntern ? internNav : <PublicNav />} />
            <div
                className={cn(
                    isIntern && 'gradient-background flex min-h-0 flex-1 flex-col overflow-y-auto',
                    !isIntern && isAwareness && 'flex flex-1 flex-col bg-linear-to-b from-[#D681B4] to-[#FFFFFF]',
                    !isIntern && !isAwareness && 'gradient-background',
                )}
                id={isIntern ? internShellScrollId : undefined}
            >
                {children}
                {!isIntern && isAwareness ? <div className="grow" /> : null}
            </div>
            {!isIntern && (
                <>
                    {isAwareness ? null : <div className="grow" />}
                    {footer}
                </>
            )}
        </div>
    );
};

export default AppShell;
