import PublicNav from '@/components/common/PublicNav';
import logo from '@/images/2026/logo_white.svg';
import cn from '@/lib/common/helper/cn';
import Image from 'next/image';
import Link from 'next/link';
import type { ReactElement, ReactNode } from 'react';

interface Props {
    fullWidth?: boolean;
    nav?: ReactNode;
}

const PageHeader = ({ fullWidth = false, nav }: Props): ReactElement => {
    return (
        <header className={cn('z-40 shrink-0 bg-black', fullWidth ? 'relative' : 'sticky top-0')}>
            <div className={cn('mx-auto flex h-15 items-center gap-4 px-4 py-2 md:px-8', fullWidth ? 'max-w-none' : 'max-w-7xl')}>
                <Link href="/" className="shrink-0">
                    <Image src={logo} alt="B-Side Festival" height={46} className="h-10 w-auto md:h-11" />
                </Link>
                <div className="grow" />
                {nav ?? <PublicNav />}
            </div>
        </header>
    );
};

export default PageHeader;
