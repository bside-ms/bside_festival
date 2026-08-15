import InternalLinks from '@/components/common/InternalLinks';
import AKKW from '@/images/logos/ak_kultur_und_wissenschaft.svg';
import SZNRW from '@/images/logos/sozio_kultur_nrw.svg';
import Image from 'next/image';
import Link from 'next/link';
import type { ReactElement } from 'react';
import { FaFacebookSquare, FaInstagram, FaMastodon } from 'react-icons/fa';

const Footer = (): ReactElement => {
    return (
        <footer>
            <div className="space-y-1 bg-black p-4 pb-6 text-center text-sm text-white">
                <div>Veranstaltet vom B-Side Kultur e.V.</div>

                <div className="flex justify-center gap-3 py-1">
                    <Link
                        href="https://www.instagram.com/bsidemuenster/"
                        target="_blank"
                        rel="me"
                        className="text-2xl hover:text-rose-400"
                        aria-label="Instagram"
                    >
                        <FaInstagram />
                    </Link>
                    <Link
                        href="https://www.facebook.com/bsidemuenster"
                        target="_blank"
                        rel="me"
                        className="text-2xl hover:text-rose-400"
                        aria-label="Facebook"
                    >
                        <FaFacebookSquare />
                    </Link>
                    <Link
                        href="https://muenster.im/@bside"
                        target="_blank"
                        rel="me"
                        className="text-2xl hover:text-rose-400"
                        aria-label="Mastodon"
                    >
                        <FaMastodon />
                    </Link>
                </div>

                <div>
                    Das B-Side Festival wird gefördert von:
                    <div className="flex flex-wrap items-center justify-center gap-6 p-5 pt-2 md:gap-8">
                        <Image src={AKKW} height="35" alt="AK Kultur und Wissenschaft" />
                        <Image src={SZNRW} height="35" alt="Sozio Kultur NRW" className="-mt-2" />
                        <div
                            className="flex h-9 min-w-20 items-center justify-center rounded border border-dashed border-white/40 px-3 text-xs text-white/70"
                            title="Logo folgt"
                        >
                            AStA
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap justify-center gap-x-3 gap-y-1">
                    <Link href="/spenden" className="underline hover:text-rose-400">
                        Spenden
                    </Link>
                    <Link href="/mithelfen" className="underline hover:text-rose-400">
                        Helfis
                    </Link>
                    <Link href="/awareness" className="underline hover:text-rose-400">
                        Awareness
                    </Link>
                    <Link href="/awareness/leichte-sprache" className="underline hover:text-rose-400">
                        Leichte Sprache
                    </Link>
                    <Link href="https://b-side.ms/kv/impressum/" className="underline hover:text-rose-400">
                        Impressum
                    </Link>
                    <Link href="https://b-side.ms/kv/datenschutz/" className="underline hover:text-rose-400">
                        Datenschutz
                    </Link>
                </div>

                <InternalLinks />
            </div>
        </footer>
    );
};

export default Footer;
