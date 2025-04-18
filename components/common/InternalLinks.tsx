import Link from 'next/link';
import type { ReactElement } from 'react';
import { getServerSession } from 'next-auth';
import authOptions from 'lib/next-auth/authOptions';

const InternalLinks = async (): Promise<ReactElement | null> => {
    const session = await getServerSession(authOptions);

    if (session === null) {
        return null;
    }

    return (
        <div className="space-y-1">
            <div>
                <Link href="/bewerbungen/uebersicht" className="cursor-pointer underline">
                    Bewerbungsübersicht
                </Link>
            </div>

            {/*<div>*/}
            {/*    <Link href="/programm/" className="cursor-pointer underline">*/}
            {/*        Programmübersicht*/}
            {/*    </Link>*/}
            {/*</div>*/}

            {/*<div>*/}
            {/*    <Link href="/mithelfen/uebersicht" className="cursor-pointer underline">*/}
            {/*        Helfer:innenübersicht*/}
            {/*    </Link>*/}
            {/*</div>*/}
        </div>
    );
};

export default InternalLinks;
