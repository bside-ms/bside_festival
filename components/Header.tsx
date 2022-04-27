import Image from 'next/image';
import Link from 'next/link';
import type { ReactElement } from 'react';

const Header = (): ReactElement => (
    <div className="flex w-full p-5">
        <Link href="https://b-side.ms" passHref={true}>
            <div className="basis-2/12 cursor-pointer hover:sepia">
                <Image
                    src="/b_heart.png"
                    alt="B-Side Logo"
                    width="2100"
                    height="1910"
                />
            </div>
        </Link>
    </div>
);

export default Header;
