'use client';

import { ReactElement, useCallback } from 'react';
import { signOut } from 'next-auth/react';

const LogoutLink = (): ReactElement => {
    const handleLogOut = useCallback(() => signOut(), []);

    return (
        <a className="cursor-pointer underline" onClick={handleLogOut}>
            Abmelden
        </a>
    );
};

export default LogoutLink;
