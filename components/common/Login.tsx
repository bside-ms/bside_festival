import { useCallback } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import type { ReactElement } from 'react';

const Login = (): ReactElement | null => {

    const { data: session, status } = useSession();

    const handleLogIn = useCallback(() => signIn('keycloak'), [signIn]);
    const handleLogOut = useCallback(() => signOut(), [signOut]);

    if (status === 'loading') {
        return null;
    }

    if (status === 'unauthenticated') {
        return (
            <a className="underline cursor-pointer" onClick={handleLogIn}>Interner Log-In</a>
        );
    }

    const userIdentifier = session?.user?.name ?? session?.user?.email ?? null;

    return (
        <>
            Angemeldet {userIdentifier !== null ? `als ${userIdentifier}` : ''}<br />
            <a className="underline cursor-pointer" onClick={handleLogOut}>Abmelden</a>
        </>
    );
};

export default Login;
