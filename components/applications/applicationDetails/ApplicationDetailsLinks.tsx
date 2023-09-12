import type { Link } from '@prisma/client';
import { default as NextLink } from 'next/link';
import type { ReactElement } from 'react';

const maxLinkLength = 50;

const ExternalLink = ({ link: { link } }: { link: Link }): ReactElement => (
    <div className="overflow-hidden whitespace-nowrap overflow-ellipsis">
        <NextLink href={link} target="_blank" className="cursor-pointer text-sky-700">
            {link.length > maxLinkLength ? `${link.slice(0, maxLinkLength)}…` : link}
        </NextLink>
    </div>
);

interface Props {
    links: Array<Link>;
}

const ApplicationDetailsLinks = ({ links }: Props): ReactElement | null => {
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

export default ApplicationDetailsLinks;
