import styles from './Button.module.scss';

import Link from 'next/link';
import type { ReactElement } from 'react';

interface Props {
    href: string;
    label: string;
}

const Button = ({ href, label }: Props): ReactElement => {

    return (
        <div className={styles.buttonContainer}>
            <Link href={href} passHref={true}>
                <button className={styles.button}>
                    {label}
                </button>
            </Link>

            <div className={styles.buttonBackdrop} />
        </div>
    );
};

export default Button;
