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
                <Link href="/bewerbungen/uebersicht" className="cursor-pointer underline">
                    Bewerbungsübersicht
                </Link>
            </div>

            <div>
                <Link href="/programm/" className="cursor-pointer underline">
                    Programmübersicht
                </Link>
            </div>

            <div>
                <Link href="/mithelfen/uebersicht" className="cursor-pointer underline">
                    Helfer:innenübersicht
                </Link>
            </div>
        </div>
    );
};

export default InternalLinks;
