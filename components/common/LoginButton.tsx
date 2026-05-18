'use client';

import { signIn } from 'next-auth/react';
import { ReactElement, useCallback } from 'react';

const LoginButton = (): ReactElement => {
    const handleLogin = useCallback(() => signIn('keycloak'), []);

    return (
        <button
            type="button"
            className="cursor-pointer rounded-full border border-white/30 px-3 py-1 text-xs text-white hover:border-white hover:bg-white hover:text-black"
            onClick={handleLogin}
        >
            Anmelden
        </button>
    );
};

export default LoginButton;
