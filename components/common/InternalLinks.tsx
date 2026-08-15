import LoginButton from '@/components/common/LoginButton';
import LogoutLink from '@/components/common/LogoutLink';
import getUserSession from '@/lib/next-auth/getUserSession';
import Link from 'next/link';
import type { ReactElement } from 'react';

const InternalLinks = async (): Promise<ReactElement | null> => {
    const userSession = await getUserSession();

    if (userSession === null) {
        return (
            <div className="mx-auto mt-4 max-w-4xl rounded border border-white/25 bg-white/5 p-3 text-xs text-white/70">
                <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2">
                    <span className="font-bold text-white">Intern</span>
                    <span aria-hidden={true}>·</span>
                    <LoginButton />
                </div>
            </div>
        );
    }

    const userIdentifier = userSession.name ?? userSession.email ?? 'unbekannt';

    return (
        <div className="mx-auto mt-4 max-w-4xl rounded border border-white/25 bg-white/5 p-3 text-xs text-white/70">
            <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
                <Link
                    href="/intern"
                    className="cursor-pointer rounded-full border border-white/30 px-3 py-1 text-white no-underline hover:border-white hover:bg-white hover:text-black"
                >
                    Intern
                </Link>
                <span aria-hidden={true}>·</span>
                <span>Angemeldet als {userIdentifier}</span>
                <span aria-hidden={true}>·</span>
                <LogoutLink />
            </div>
        </div>
    );
};

export default InternalLinks;
