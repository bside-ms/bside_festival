import LogoutLink from '@/components/common/LogoutLink';
import getUserSession from '@/lib/next-auth/getUserSession';
import Link from 'next/link';
import type { ReactElement } from 'react';

const InternalLinks = async (): Promise<ReactElement | null> => {
    const userSession = await getUserSession();

    if (userSession === null) {
        return null;
    }

    const userIdentifier = userSession.name ?? userSession.email ?? 'unbekannt';
    const links = [
        { href: '/bewerbungen/kuration', label: 'Kuration' },
        { href: '/bewerbungen/uebersicht', label: 'Bewerbungsübersicht' },
        { href: '/bewerbungen', label: 'Bewerbungsformular' },
        { href: '/programm/', label: 'Programmübersicht' },
        { href: '/mithelfen/uebersicht', label: 'Helfer:innenübersicht' },
    ];

    return (
        <div className="mx-auto mt-4 max-w-4xl rounded border border-white/25 bg-white/5 p-3 text-left">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-white/70">
                <span className="font-bold text-white">Intern</span>
                <span aria-hidden={true}>·</span>
                <span>Angemeldet als {userIdentifier}</span>
                <span aria-hidden={true}>·</span>
                <LogoutLink />
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
                {links.map(({ href, label }) => (
                    <Link
                        key={href}
                        href={href}
                        className="cursor-pointer rounded-full border border-white/30 px-3 py-1 text-xs text-white no-underline hover:border-white hover:bg-white hover:text-black"
                    >
                        {label}
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default InternalLinks;
