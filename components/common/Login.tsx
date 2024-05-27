import { useCallback } from 'react';
import { signOut, useSession } from 'next-auth/react';
import type { ReactElement } from 'react';
import LoginLink from 'components/common/LoginLink';

const Login = (): ReactElement | null => {
    const { data: session, status } = useSession();

    const handleLogOut = useCallback(() => signOut(), []);

    if (status === 'loading') {
        return null;
    }

    if (status === 'unauthenticated') {
        return <LoginLink />;
    }

    const userIdentifier = session?.user?.name ?? session?.user?.email ?? null;

    return (
        <>
            Angemeldet {userIdentifier !== null ? `als ${userIdentifier}` : ''}
            <br />
            <a className="cursor-pointer underline" onClick={handleLogOut}>
                Abmelden
            </a>
        </>
    );
};

export default Login;
