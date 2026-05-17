import InternalLinks from '@/components/common/InternalLinks';
import Image from 'next/image';
import Link from 'next/link';
import type { ReactElement } from 'react';
import { FaFacebookSquare, FaInstagram, FaMastodon } from 'react-icons/fa';

import AKKW from '@/images/logos/ak_kultur_und_wissenschaft.svg';
import SZNRW from '@/images/logos/sozio_kultur_nrw.svg';

const Footer = (): ReactElement => {
    return (
        <div>
            <div className="space-y-1 bg-black p-4 pb-6 text-center text-sm text-white">
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

                <div>
                    Gefördert von
                    <div className="flex items-center justify-center gap-8 p-5 pt-1">
                        <Image src={AKKW} height="35" alt="AK Kultur und Wissenschaft" />
                        <Image src={SZNRW} height="35" alt="Sozio Kultur NRW" className="-mt-2" />
                    </div>
                </div>

                <div className="flex justify-center gap-3">
                    <Link href="https://b-side.ms/kv/impressum/" className="underline hover:text-red-600">
                        Impressum
                    </Link>
                    <Link href="https://b-side.ms/kv/datenschutz/" className="underline hover:text-red-600">
                        Datenschutz
                    </Link>
                </div>

                <InternalLinks />
            </div>
        </div>
    );
};

export default Footer;
