import isLoggedIn from '@/lib/next-auth/isLoggedIn';
import Link from 'next/link';
import type { ReactElement } from 'react';

const InternalLinks = async (): Promise<ReactElement | null> => {
    const loggedIn = await isLoggedIn();

    if (!loggedIn) {
        return null;
    }

    return (
        <div className="space-y-1">
            <div>
                <Link href="/bewerbungen/uebersicht" className="cursor-pointer underline hover:text-red-600">
                    Bewerbungsübersicht
                </Link>
            </div>
            <div>
                <Link href="/bewerbungen" className="cursor-pointer underline hover:text-red-600">
                    Bewerbungsformular
                </Link>
            </div>

            <div>
                <Link href="/programm/" className="cursor-pointer underline">
                    Programmübersicht
                </Link>
            </div>

            {/*<div>*/}
            {/*    <Link href="/mithelfen/uebersicht" className="cursor-pointer underline">*/}
            {/*        Helfer:innenübersicht*/}
            {/*    </Link>*/}
            {/*</div>*/}
        </div>
    );
};

export default InternalLinks;
