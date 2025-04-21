'use client';

import { signOut } from 'next-auth/react';
import { ReactElement, useCallback } from 'react';

const LogoutLink = (): ReactElement => {
    const handleLogOut = useCallback(() => signOut(), []);

    return (
        <a className="cursor-pointer underline hover:text-red-600" onClick={handleLogOut}>
            Abmelden
        </a>
    );
};

export default LogoutLink;
