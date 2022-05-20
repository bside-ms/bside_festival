import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import type { ReactElement } from 'react';
import { faFacebookSquare, faInstagram } from '@fortawesome/free-brands-svg-icons';

const Footer = (): ReactElement => {

    const imprintLink = (
        <Link href="https://b-side.ms/kv/impressum/">
            <a className="underline">Impressum</a>
        </Link>
    );
    const privacyPolicyLink = (
        <Link href="https://b-side.ms/kv/datenschutz/">
            <a className="underline">Datenschutz</a>
        </Link>
    );

    const instagramLink = (
        <Link href="https://www.instagram.com/bsidemuenster/">
            <a className="p-3 text-xl" target="_blank">
                <FontAwesomeIcon icon={faInstagram} />
            </a>
        </Link>
    );

    const facebookLink = (
        <Link href="https://www.facebook.com/bsidemuenster">
            <a className="p-3 text-xl" target="_blank">
                <FontAwesomeIcon icon={faFacebookSquare} />
            </a>
        </Link>
    );

    return (
        <div className="text-sm text-gray-400 text-center p-4 bg-gray-800">
            <div>Veranstaltet durch den B-Side Kultur e.V.</div>

            <div className="mt-1 flex gap-3 justify-center">
                <span>{instagramLink}</span> <span>{facebookLink}</span>
            </div>

            <div className="mt-1 flex gap-3 justify-center">
                <span>{imprintLink}</span> <span>{privacyPolicyLink}</span>
            </div>
        </div>
    );
};

export default Footer;
