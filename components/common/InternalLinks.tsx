import LoginButton from '@/components/common/LoginButton';
import LogoutLink from '@/components/common/LogoutLink';
import getUserSession from '@/lib/next-auth/getUserSession';
import Link from 'next/link';
import type { ReactElement } from 'react';

const discreetClass = 'text-white/70 no-underline hover:text-white hover:underline';

const InternalLinks = async (): Promise<ReactElement> => {
    const userSession = await getUserSession();

    if (userSession === null) {
        return (
            <LoginButton variant="text" className="text-xs">
                Intern
            </LoginButton>
        );
    }

    return (
        <>
            <Link href="/intern" className={discreetClass}>
                Intern
            </Link>
            <LogoutLink className={discreetClass} />
        </>
    );
};

export default InternalLinks;
