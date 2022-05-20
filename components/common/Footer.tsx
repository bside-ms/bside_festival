import Link from 'next/link';
import type { ReactElement } from 'react';

const Footer = (): ReactElement => {

    const link1 = (
        <Link href="https://b-side.ms/kv/impressum/">
            <a className="underline">Impressum</a>
        </Link>
    );
    const link2 = (
        <Link href="https://b-side.ms/kv/datenschutz/">
            <a className="underline">Datenschutzerklärung</a>
        </Link>
    );

    return (
        <div className="text-sm text-gray-400 text-center p-4 bg-gray-800">
            <div>Veranstaltet durch den B-Side Kultur e.V.</div>
            <div className="mt-1 flex gap-3 justify-center">
                <span>{link1}</span> <span>{link2}</span>
            </div>
        </div>
    );
};

export default Footer;
