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
            <CiGlobe /> <span className="text-sm">{link.hostname.replace(/^www./, '')}</span>
        </>
    );
};

const ExternalLink = ({ link: { link } }: { link: Link }): ReactElement => {
    const normalizedLink = /^https?:\/\//.test(link) ? link : `https://${link}`;

    return (
        <NextLink
            href={normalizedLink}
            target="_blank"
            className="inline-flex cursor-pointer items-center gap-1 rounded bg-gray-400/40 p-1 text-xl text-sky-400 hover:bg-gray-400/50"
        >
            <LinkBadge link={new URL(normalizedLink)} />
        </NextLink>
    );
};

interface Props {
    links: Array<Link>;
}

const ApplicationDetailsLinks = ({ links }: Props): ReactElement | null => {
    if (links.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-wrap gap-2">
            {links.map((link) => (
                <ExternalLink key={link.id} link={link} />
            ))}
        </div>
    );
};

export default ApplicationDetailsLinks;
