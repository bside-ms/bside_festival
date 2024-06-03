import type { Link } from '@prisma/client';
import { default as NextLink } from 'next/link';
import type { ReactElement } from 'react';
import { FaBandcamp, FaFacebook, FaInstagram, FaSoundcloud, FaSpotify, FaYoutube } from 'react-icons/fa';
import { CiGlobe } from 'react-icons/ci';

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
            <CiGlobe /> {link.hostname.replace(/^www./, '')}
        </>
    );
};

const ExternalLink = ({ link: { link } }: { link: Link }): ReactElement => {
    const normalizedLink = /^https?:\/\//.test(link) ? link : `https://${link}`;

    return (
        <NextLink
            href={normalizedLink}
            target="_blank"
            className="inline-flex cursor-pointer items-center gap-1 rounded bg-gray-200/50 p-1  text-sky-700 hover:bg-gray-200/70"
        >
            <LinkBadge link={new URL(normalizedLink)} />
        </NextLink>
    );
};

interface Props {
    links: Array<Link>;
}

const Links = ({ links }: Props): ReactElement | null => {
    if (links.length === 0) {
        return null;
    }

    return (
        <div className="mt-4">
            {links.map((link) => (
                <ExternalLink key={link.id} link={link} />
            ))}
        </div>
    );
};

export default Links;
