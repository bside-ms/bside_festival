import type { Link } from '@prisma/client';
import { default as NextLink } from 'next/link';
import type { ReactElement } from 'react';
import { CiGlobe } from 'react-icons/ci';
import { FaBandcamp, FaFacebook, FaInstagram, FaSoundcloud, FaSpotify, FaYoutube } from 'react-icons/fa';

const LinkBadge = ({ link }: { link: URL }): ReactElement => {
    if (link.hostname.includes('instagram.')) {
        return <FaInstagram title="Instagram" />;
    }

    if (link.hostname.includes('spotify.')) {
        return <FaSpotify title="Spotify" />;
    }

    if (link.hostname.includes('facebook.')) {
        return <FaFacebook title="Facebook" />;
    }

    if (link.hostname.includes('bandcamp.')) {
        return <FaBandcamp title="Bandcamp" />;
    }

    if (link.hostname.includes('soundcloud.')) {
        return <FaSoundcloud title="Soundcloud" />;
    }

    if (link.hostname.includes('youtube.') || link.hostname.includes('youtu.be')) {
        return <FaYoutube title="YouTube" />;
    }

    return (
        <>
            <CiGlobe /> <span className="text-xs">{link.hostname.replace(/^www./, '')}</span>
        </>
    );
};

const ExternalLink = ({ link: { link, isConfidential } }: { link: Link }): ReactElement => {
    const normalizedLink = /^https?:\/\//.test(link) ? link : `https://${link}`;

    return (
        <NextLink
            href={normalizedLink}
            target="_blank"
            className="inline-flex cursor-pointer items-center gap-1 rounded bg-gray-200/50 p-1 text-sky-500 hover:bg-gray-200/70"
        >
            <LinkBadge link={new URL(normalizedLink)} /> {isConfidential && <span className="text-xs">(nicht öffentlich)</span>}
        </NextLink>
    );
};

interface Props {
    links: Array<Link>;
    isLoggedIn: boolean;
}

const ParticipantLinks = ({ links, isLoggedIn }: Props): ReactElement | null => {
    const shownLinks = links.filter((link) => isLoggedIn || !link.isConfidential);

    if (shownLinks.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-wrap gap-2">
            {shownLinks.map((link) => (
                <ExternalLink key={link.id} link={link} />
            ))}
        </div>
    );
};

export default ParticipantLinks;
