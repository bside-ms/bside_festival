import InternalLinks from 'components/common/InternalLinks';
import Login from 'components/common/Login';
import cn from 'lib/common/helper/cn';
import Link from 'next/link';
import type { ReactElement } from 'react';
import { FaFacebookSquare, FaInstagram, FaMastodon } from 'react-icons/fa';

interface Props {
    whiteBackground?: boolean;
}

const Footer = ({ whiteBackground = false }: Props): ReactElement => {
    return (
        <div
            className={cn(
                whiteBackground
                    ? 'mt-4 space-y-1 border-t-4 border-red-600 p-4 pb-6 text-center text-sm text-black'
                    : 'space-y-1 bg-black p-4 pb-6 text-center text-sm text-white',
            )}
        >
            <div>Veranstaltet durch den B-Side Kultur e.V.</div>

            <div className="flex justify-center gap-3 py-1">
                <Link href="https://www.instagram.com/bsidemuenster/" target="_blank" rel="me" className="text-2xl hover:text-red-600">
                    <FaInstagram />
                </Link>
                <Link href="https://www.facebook.com/bsidemuenster" target="_blank" rel="me" className="text-2xl hover:text-red-600">
                    <FaFacebookSquare />
                </Link>
                <Link href="https://muenster.im/@bside" target="_blank" rel="me" className="text-2xl hover:text-red-600">
                    <FaMastodon />
                </Link>
            </div>

            <div className="flex justify-center gap-3">
                <Link href="https://b-side.ms/kv/impressum/" className="underline hover:text-red-600">
                    Impressum
                </Link>
                <Link href="https://b-side.ms/kv/datenschutz/" className="underline hover:text-red-600">
                    Datenschutz
                </Link>
            </div>

            <div className="space-y-1">
                <Login />

                <InternalLinks />
            </div>
        </div>
    );
};

export default Footer;
