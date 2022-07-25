import Link from 'next/link';
import { useSession } from 'next-auth/react';
import type { ReactElement } from 'react';

const InternalLinks = (): ReactElement | null => {

    const { status } = useSession();

    if (status !== 'authenticated') {
        return null;
    }

    return (
        <div className="space-y-1">
            <div>
                <Link href="/bewerbung/uebersicht">
                    <a className="underline cursor-pointer">Bewerbungsübersicht</a>
                </Link>
            </div>
            <div>
                <Link href="/programm/slotplan">
                    <a className="underline cursor-pointer">Slotplan</a>
                </Link>
            </div>
        </div>
    );
};

export default InternalLinks;
