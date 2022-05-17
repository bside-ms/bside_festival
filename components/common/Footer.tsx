import Link from 'next/link';
import type { ReactElement } from 'react';

const Footer = (): ReactElement => {

    const link = (
        <Link href="https://b-side.ms/kv/impressum/">
            <a className="underline">B-Side Kultur e.V.</a>
        </Link>
    );

    return (
        <div className="text-sm text-gray-400 text-center p-4 bg-gradient-to-t bg-gray-800">
            Veranstaltet durch den {link}
        </div>
    );
};

export default Footer;
