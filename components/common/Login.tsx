import LoginLink from '@/components/common/LoginLink';
import LogoutLink from '@/components/common/LogoutLink';
import getUserSession from '@/lib/next-auth/getUserSession';
import type { ReactElement } from 'react';

const Login = async (): Promise<ReactElement | null> => {
    const userSession = await getUserSession();

    if (userSession === null) {
        return <LoginLink />;
    }

    const userIdentifier = userSession.name ?? userSession.email ?? null;

    return (
        <>
            Angemeldet {userIdentifier !== null ? `als ${userIdentifier}` : ''}
            <br />
            <LogoutLink />
        </>
    );
};

export default Login;
