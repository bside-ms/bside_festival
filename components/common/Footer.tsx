import InternalLinks from '@/components/common/InternalLinks';
import hansaFloss from '@/images/logos/hansa-floss.png';
import mkwNrw from '@/images/logos/mkw-nrw.svg';
import romeroInitiative from '@/images/logos/romero-initiative.png';
import soziokulturNrw from '@/images/logos/sozio_kultur_nrw.svg';
import stadtMuensterKi from '@/images/logos/stadt-muenster-ki.png';
import stadtMuensterKulturamt from '@/images/logos/stadt-muenster-kulturamt.png';
import stupaMs from '@/images/logos/stupa-ms.png';
import cn from '@/lib/common/helper/cn';
import Image, { type StaticImageData } from 'next/image';
import Link from 'next/link';
import type { ReactElement } from 'react';
import { FaFacebookSquare, FaInstagram, FaMastodon } from 'react-icons/fa';

type Funder = {
    id: string;
    src: StaticImageData;
    alt: string;
    href: string;
    height: number;
    invert?: boolean;
};

const funders: Funder[] = [
    {
        id: 'kulturamt',
        src: stadtMuensterKulturamt,
        alt: 'Stadt Münster Kulturamt',
        href: 'https://www.stadt-muenster.de/kulturamt',
        height: 40,
        invert: true,
    },
    {
        id: 'mkw',
        src: mkwNrw,
        alt: 'Ministerium für Kultur und Wissenschaft des Landes Nordrhein-Westfalen',
        href: 'https://www.mkw.nrw/',
        height: 36,
    },
    {
        id: 'soziokultur',
        src: soziokulturNrw,
        alt: 'Soziokultur NRW',
        href: 'https://www.soziokultur-nrw.de/',
        height: 40,
    },
    {
        id: 'romero',
        src: romeroInitiative,
        alt: 'Romero Initiative — Stimme für Gerechtigkeit',
        href: 'https://www.ci-romero.de/',
        height: 36,
    },
    {
        id: 'ki',
        src: stadtMuensterKi,
        alt: 'KI Kommunales Integrationszentrum Münster',
        href: 'https://www.stadt-muenster.de/zuwanderung/ueber-das-ki',
        height: 44,
        invert: true,
    },
    {
        id: 'stupa',
        src: stupaMs,
        alt: 'Studierendenparlament der Universität Münster',
        href: 'https://stupa.ms/',
        height: 36,
    },
    {
        id: 'hansafloss',
        src: hansaFloss,
        alt: 'Hansa Floß',
        href: 'https://www.hansafloss-muenster.de/',
        height: 36,
    },
];

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
                    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-5 p-5 pt-3 md:gap-x-8">
                        {funders.map((funder) => (
                            <Link
                                key={funder.id}
                                href={funder.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center"
                            >
                                <Image
                                    src={funder.src}
                                    height={funder.height}
                                    alt={funder.alt}
                                    className={cn('h-9 w-auto md:h-10', funder.invert && 'invert')}
                                />
                            </Link>
                        ))}
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
