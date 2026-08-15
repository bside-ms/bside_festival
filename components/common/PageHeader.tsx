import logo from '@/images/2026/logo_white.svg';
import instagramIcon from '@/images/icons/instagram.svg';
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
        <header className="relative z-40 shrink-0 bg-black">
            <div className={cn('flex h-15 gap-4 px-4 py-2', fullWidth && 'items-center')}>
                <Link href="/" className={fullWidth ? 'shrink-0' : 'md:mt-3 md:ml-12 md:translate-1/2'}>
                    <Image src={logo} alt="" height={46} />
                </Link>
                <div className="grow" />
                {nav ?? (
                    <Link href="https://www.instagram.com/bside.festival.ms/" className="mt-2" target="_blank">
                        <Image src={instagramIcon} alt="" height={30} />
                    </Link>
                )}
            </div>
        </header>
    );
};

export default PageHeader;
