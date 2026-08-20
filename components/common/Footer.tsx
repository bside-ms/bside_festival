import FooterWaves from '@/components/common/FooterWaves';
import InternalLinks from '@/components/common/InternalLinks';
import PublicHashLink from '@/components/common/PublicHashLink';
import logoKulturEv from '@/images/2026/logo_kultur_ev.svg';
import hansaFloss from '@/images/logos/hansa-floss.png';
import mkwNrw from '@/images/logos/mkw-nrw.svg';
import romeroInitiative from '@/images/logos/romero-initiative.png';
import soziokulturNrw from '@/images/logos/sozio_kultur_nrw.svg';
import stadtMuensterKi from '@/images/logos/stadt-muenster-ki.png';
import stadtMuensterKulturamt from '@/images/logos/stadt-muenster-kulturamt.png';
import stupaMs from '@/images/logos/stupa-ms.png';
import cn from '@/lib/common/helper/cn';
import { getProgrammNavLink } from '@/lib/public/publicNav';
import { compact } from 'lodash';
import Image, { type StaticImageData } from 'next/image';
import Link from 'next/link';
import type { ReactElement } from 'react';

type Funder = {
    id: string;
    src: StaticImageData;
    alt: string;
    href: string;
    height: number;
    invert?: boolean;
};

type FooterLink = {
    href: string;
    id: string;
    label: string;
    external?: boolean;
};

type FooterColumn = {
    id: string;
    label: string;
    links: FooterLink[];
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

const legalLinks: FooterLink[] = [
    { id: 'impressum', label: 'Impressum', href: 'https://b-side.ms/kv/impressum/', external: true },
    { id: 'datenschutz', label: 'Datenschutz', href: 'https://b-side.ms/kv/datenschutz/', external: true },
    { id: 'kontakt', label: 'Kontakt', href: 'mailto:festival@b-side.ms' },
];

const linkClass = 'text-white no-underline hover:underline';
const legalClass = 'text-white/80 no-underline hover:text-white hover:underline';

const getFooterColumns = (): FooterColumn[] => [
    {
        id: 'festival-2026',
        label: 'Festival 2026',
        links: compact([
            getProgrammNavLink(),
            // { id: 'orte', label: 'Orte', href: '/#wo-und-wann' },
            { id: 'info', label: 'Info', href: '/#ueber-uns' },
            { id: 'awareness', label: 'Awareness', href: '/awareness' },
        ]),
    },
    {
        id: 'mitwirken',
        label: 'Mitwirken',
        links: [
            { id: 'helfis', label: 'Helfis', href: '/mithelfen' },
            { id: 'spenden', label: 'Spenden', href: '/spenden' },
        ],
    },
    {
        id: 'socials',
        label: 'Socials',
        links: [
            { id: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/bside.festival.ms/', external: true },
            { id: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/bsidemuenster', external: true },
            { id: 'mastodon', label: 'Mastodon', href: 'https://muenster.im/@bside', external: true },
        ],
    },
];

const FooterNavLink = ({ href, label, external }: Omit<FooterLink, 'id'>): ReactElement => {
    if (external === true) {
        return (
            <Link href={href} target="_blank" rel="me noopener noreferrer" className={linkClass}>
                {label}
            </Link>
        );
    }

    return (
        <PublicHashLink href={href} className={linkClass}>
            {label}
        </PublicHashLink>
    );
};

const Footer = (): ReactElement => {
    const columns = getFooterColumns();

    return (
        <footer className="overflow-hidden bg-[#40a8f5] font-display text-white">
            <div className="mx-auto w-full max-w-7xl px-6 pt-16 pb-10 md:px-8 md:pt-20">
                <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
                    <div className="max-w-sm">
                        <Image src={logoKulturEv} alt="B-Side Kultur e.V." width={149} height={149} className="h-auto w-36 md:w-40" />
                        <p className="mt-5 text-sm leading-relaxed text-white/95">
                            Veranstaltet vom B-Side Kultur e.V.
                            <br />
                            Eine zeitgenössische, unabhängige und von der Community organisierte Musik- und Kulturveranstaltung in Münster.
                        </p>
                    </div>

                    <nav aria-label="Fußzeile" className="grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-12">
                        {columns.map((column) => (
                            <div key={column.id}>
                                <div className="text-xs font-bold tracking-[0.2em] text-[#f2c48d] uppercase">{column.label}</div>
                                <ul className="mt-3 space-y-2">
                                    {column.links.map((link) => (
                                        <li key={link.id}>
                                            <FooterNavLink {...link} />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </nav>
                </div>

                <p className="mt-14 text-5xl leading-none font-black text-black sm:text-6xl md:mt-16 md:text-7xl lg:text-8xl">
                    Kultur. Hafen. Kante!
                </p>

                <div className="mt-12 text-sm">
                    Das B-Side Festival wird gefördert von:
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-5 pt-4 md:gap-x-8">
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

                <div className="mt-10 flex flex-col gap-3 text-xs sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-white/80">B-Side Festival © 2026. Aus Münster.</div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                        {legalLinks.map((link) =>
                            link.external === true ? (
                                <Link key={link.id} href={link.href} target="_blank" rel="noopener noreferrer" className={legalClass}>
                                    {link.label}
                                </Link>
                            ) : (
                                <Link key={link.id} href={link.href} className={legalClass}>
                                    {link.label}
                                </Link>
                            ),
                        )}
                        <InternalLinks />
                    </div>
                </div>
            </div>

            <FooterWaves />
        </footer>
    );
};

export default Footer;
