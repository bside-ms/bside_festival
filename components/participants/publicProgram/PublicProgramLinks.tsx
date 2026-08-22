import type { Link as ParticipantLink } from '@prisma/client';
import type { ReactElement } from 'react';
import { CiGlobe } from 'react-icons/ci';
import { FaBandcamp, FaFacebook, FaInstagram, FaSoundcloud, FaSpotify, FaTiktok, FaYoutube } from 'react-icons/fa';

interface LinkPresentation {
    href: string;
    hostname: string;
    kind: 'bandcamp' | 'facebook' | 'instagram' | 'soundcloud' | 'spotify' | 'tiktok' | 'website' | 'youtube';
    label: string;
}

const getLinkPresentation = ({ link }: ParticipantLink): LinkPresentation | null => {
    const href = /^https?:\/\//.test(link) ? link : `https://${link}`;

    try {
        const { hostname } = new URL(href);
        const domain = hostname.replace(/^www\./, '');

        if (domain.includes('instagram.')) {
            return { href, hostname, kind: 'instagram', label: 'Instagram' };
        }

        if (domain.includes('spotify.')) {
            return { href, hostname, kind: 'spotify', label: 'Spotify' };
        }

        if (domain.includes('facebook.')) {
            return { href, hostname, kind: 'facebook', label: 'Facebook' };
        }

        if (domain.includes('bandcamp.')) {
            return { href, hostname, kind: 'bandcamp', label: 'Bandcamp' };
        }

        if (domain.includes('soundcloud.')) {
            return { href, hostname, kind: 'soundcloud', label: 'Soundcloud' };
        }

        if (domain.includes('tiktok.')) {
            return { href, hostname, kind: 'tiktok', label: 'TikTok' };
        }

        if (domain.includes('youtube.') || domain.includes('youtu.be')) {
            return { href, hostname, kind: 'youtube', label: 'YouTube' };
        }

        return { href, hostname, kind: 'website', label: domain };
    } catch {
        return null;
    }
};

const LinkIcon = ({ kind }: Pick<LinkPresentation, 'kind'>): ReactElement => {
    if (kind === 'instagram') {
        return <FaInstagram aria-hidden />;
    }

    if (kind === 'spotify') {
        return <FaSpotify aria-hidden />;
    }

    if (kind === 'facebook') {
        return <FaFacebook aria-hidden />;
    }

    if (kind === 'bandcamp') {
        return <FaBandcamp aria-hidden />;
    }

    if (kind === 'soundcloud') {
        return <FaSoundcloud aria-hidden />;
    }

    if (kind === 'tiktok') {
        return <FaTiktok aria-hidden />;
    }

    if (kind === 'youtube') {
        return <FaYoutube aria-hidden />;
    }

    return <CiGlobe aria-hidden />;
};

interface Props {
    links: Array<ParticipantLink>;
}

const PublicProgramLinks = ({ links }: Props): ReactElement | null => {
    const shownLinks = links.map(getLinkPresentation).filter((link): link is LinkPresentation => link !== null);

    if (shownLinks.length === 0) {
        return null;
    }

    return (
        <section aria-labelledby="program-links-title">
            <h2 id="program-links-title" className="text-xl font-black text-[#2C2E83]">
                Links
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
                {shownLinks.map(({ href, hostname, kind, label }) => (
                    <a
                        key={href}
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${label} öffnen`}
                        className="inline-flex items-center gap-2 rounded-full bg-[#2C2E83] px-4 py-2 font-bold text-white no-underline transition hover:bg-black focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#2C2E83]"
                        title={hostname}
                    >
                        <LinkIcon kind={kind} />
                        <span>{label}</span>
                    </a>
                ))}
            </div>
        </section>
    );
};

export default PublicProgramLinks;
