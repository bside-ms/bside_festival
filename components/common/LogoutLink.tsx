'use client';

import cn from '@/lib/common/helper/cn';
import { signOut } from 'next-auth/react';
import { ReactElement, useCallback } from 'react';

interface Props {
    className?: string;
}

const LogoutLink = ({ className }: Props): ReactElement => {
    const handleLogOut = useCallback(() => signOut(), []);

    return (
        <a className={cn('cursor-pointer underline hover:text-red-600', className)} onClick={handleLogOut}>
            Abmelden
        </a>
    );
};

export default LogoutLink;
