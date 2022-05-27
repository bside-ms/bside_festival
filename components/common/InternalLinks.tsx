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
            <Link href="/bewerbung/uebersicht">
                <a className="underline cursor-pointer">Bewerbungsübersicht</a>
            </Link>
        </div>
    );
};

export default InternalLinks;
