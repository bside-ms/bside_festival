import type { ReactElement } from 'react';
import LoginLink from 'components/common/LoginLink';
import getUserSession from 'lib/next-auth/getUserSession';
import LogoutLink from 'components/common/LogoutLink';

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
