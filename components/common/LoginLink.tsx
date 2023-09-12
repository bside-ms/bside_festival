import { useCallback } from 'react';
import { signIn } from 'next-auth/react';
import type { ReactElement } from 'react';

const LoginLink = (): ReactElement => {
    const handleLogIn = useCallback(() => signIn('keycloak'), []);

    return (
        <a className="underline cursor-pointer" onClick={handleLogIn}>
            Interner Log-In
        </a>
    );
};

export default LoginLink;
