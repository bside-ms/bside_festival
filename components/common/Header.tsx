import Image from 'next/image';
import Link from 'next/link';
import type { ReactElement } from 'react';
import BHeartLinesSvg from 'components/common/BHeartLinesSvg';

const Header = (): ReactElement => {
    return (
        <Link href="/" className="flex gap-3 items-center">
            <div className="relative w-12 md:w-16 aspect-square">
                <Image src="/assets/frontpage-heart-red.webp" alt="Eyecatcher" fill={true} className="object-contain object-left" />
            </div>

            <div className="text-2xl md:text-3xl pt-1 md:pt-2">B-Side Festival 2024</div>

            <div className="absolute top-8 md:top-10">
                <div className="relative w-12 md:w-16 aspect-square">
                    <div className="relative w-full aspect-square -mt-4">
                        <BHeartLinesSvg color="#000" />
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default Header;
