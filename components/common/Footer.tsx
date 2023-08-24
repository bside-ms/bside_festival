// Don't know atm what the problem is

import { faFacebookSquare, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import type { ReactElement } from 'react';
import InternalLinks from 'components/common/InternalLinks';
import Login from 'components/common/Login';

const Footer = (): ReactElement => {

    const imprintLink = (
        <Link href="https://b-side.ms/kv/impressum/" className="underline">
            Impressum
        </Link>
    );
    const privacyPolicyLink = (
        <Link href="https://b-side.ms/kv/datenschutz/" className="underline">
            Datenschutz
        </Link>
    );

    const instagramLink = (
        <Link
            href="https://www.instagram.com/bsidemuenster/"
            target="_blank"
        >
            <FontAwesomeIcon className="w-[25px]" icon={faInstagram} />
        </Link>
    );

    const facebookLink = (
        <Link
            href="https://www.facebook.com/bsidemuenster"
            target="_blank"
        >
            <FontAwesomeIcon className="w-[25px]" icon={faFacebookSquare} />
        </Link>
    );

    return (
        <div className="text-sm text-white text-center p-4 bg-black space-y-1">
            <div>Veranstaltet durch den B-Side Kultur e.V.</div>

            <div className="flex gap-3 justify-center py-1">
                <span>{instagramLink}</span> <span>{facebookLink}</span>
            </div>

            <div className="flex gap-3 justify-center">
                <span>{imprintLink}</span> <span>{privacyPolicyLink}</span>
            </div>

            <div className="space-y-1">
                <Login />

                <InternalLinks />
            </div>
        </div>
    );
};

export default Footer;
