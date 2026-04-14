import logo from '@/images/2026/logo_white.svg';
import instagramIcon from '@/images/icons/instagram.svg';
import Image from 'next/image';
import Link from 'next/link';

const PageHeader = () => {
    return (
        <div className="flex h-15 gap-4 bg-black px-4 py-2">
            <Link href="/" className="md:mt-3 md:ml-12 md:translate-1/2">
                <Image src={logo} alt="" height={46} />
            </Link>
            <div className="grow" />
            <Link href="https://www.instagram.com/bside.festival.ms/" className="mt-2" target="_blank">
                <Image src={instagramIcon} alt="" height={30} />
            </Link>
        </div>
    );
};

export default PageHeader;
