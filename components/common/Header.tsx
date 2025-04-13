import Image from 'next/image';
import Link from 'next/link';
import type { ReactElement } from 'react';
import BHeartLinesSvg from 'components/common/BHeartLinesSvg';

const Header = (): ReactElement => {
    return (
        <Link href="/" className="flex items-center gap-3">
            <div className="relative aspect-square w-12 md:w-16">
                <Image src="/assets/frontpage-heart-red.webp" alt="Eyecatcher" fill={true} className="object-contain object-left" />
            </div>

            <div className="pt-1 text-2xl md:pt-2 md:text-3xl">B-Side Festival 2025</div>

            <div className="absolute top-8 md:top-10">
                <div className="relative aspect-square w-12 md:w-16">
                    <div className="relative -mt-4 aspect-square w-full">
                        <BHeartLinesSvg color="#000" />
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default Header;
