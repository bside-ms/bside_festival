import styles from './Button.module.scss';

import Link from 'next/link';
import type { ButtonHTMLAttributes, ReactElement, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    href?: string;
    onClick?: () => void;
    isDisabled?: boolean;
    type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
}

const Button = ({ href, onClick, children, isDisabled = false, type = 'button' }: Props): ReactElement => {

    const button = (
        <button
            className={`${styles.button}`}
            type={type}
            disabled={isDisabled}
            onClick={onClick}
        >
            {children}
        </button>
    );

    return (
        <div
            className={`${styles.buttonContainer} ${isDisabled ? 'grayscale brightness-150' : ''}`}
        >
            {href !== undefined ? (
                <Link href={href} passHref={true}>
                    {button}
                </Link>
            ) : button}

            <div className={styles.buttonBackdrop} />
        </div>
    );
};

export default Button;
