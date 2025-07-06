import bsideHeartIcon from 'images/icons/bsideHeart.svg';
import instagramIcon from 'images/icons/instagram.svg';
import Image from 'next/image';
import Link from 'next/link';

const PageHeader = () => {
    return (
        <div className="flex justify-end gap-4 bg-black px-4 py-2">
            <Link href="/" className="mr-auto">
                <Image src={bsideHeartIcon} alt="" height={24} />
            </Link>

            {/* <Image src={mapIcon} alt="" height={24} /> */}

            <Link href="https://www.instagram.com/bside.festival.ms/" target="_blank">
                <Image src={instagramIcon} alt="" height={24} />
            </Link>
        </div>
    );
};

export default PageHeader;
