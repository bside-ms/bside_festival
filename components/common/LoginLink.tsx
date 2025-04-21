'use client';

import { signIn } from 'next-auth/react';
import type { ReactElement } from 'react';
import { useCallback } from 'react';

const LoginLink = (): ReactElement => {
    const handleLogIn = useCallback(() => signIn('keycloak'), []);

    return (
        <a className="cursor-pointer underline hover:text-red-600" onClick={handleLogIn}>
            Interner Log-In
        </a>
    );
};

export default LoginLink;
