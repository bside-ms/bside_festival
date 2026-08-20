'use client';

import cn from '@/lib/common/helper/cn';
import { signIn } from 'next-auth/react';
import { type ReactElement, type ReactNode, useCallback } from 'react';

type Props = {
    children?: ReactNode;
    className?: string;
    variant?: 'pill' | 'text';
};

const LoginButton = ({ children = 'Anmelden', className, variant = 'pill' }: Props): ReactElement => {
    const handleLogin = useCallback(() => signIn('keycloak'), []);

    return (
        <button
            type="button"
            className={cn(
                'cursor-pointer',
                variant === 'pill' &&
                    'rounded-full border border-white/30 px-3 py-1 text-xs text-white hover:border-white hover:bg-white hover:text-black',
                variant === 'text' && 'text-white/70 hover:text-white hover:underline',
                className,
            )}
            onClick={handleLogin}
        >
            {children}
        </button>
    );
};

export default LoginButton;
