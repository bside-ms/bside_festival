import { faFacebookSquare, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import InternalLinks from 'components/common/InternalLinks';
import Login from 'components/common/Login';
import cn from 'lib/common/helper/cn';
import Link from 'next/link';
import type { ReactElement } from 'react';

interface Props {
    whiteBackground?: boolean;
}

const Footer = ({ whiteBackground = false }: Props): ReactElement => {
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
        <Link href="https://www.instagram.com/bsidemuenster/" target="_blank">
            <FontAwesomeIcon className="w-[25px]" icon={faInstagram} />
        </Link>
    );

    const facebookLink = (
        <Link href="https://www.facebook.com/bsidemuenster" target="_blank">
            <FontAwesomeIcon className="w-[25px]" icon={faFacebookSquare} />
        </Link>
    );

    return (
        <div
            className={cn(
                whiteBackground
                    ? 'mt-4 space-y-1 border-t-4 border-red-600 p-4 pb-6 text-center text-sm text-black'
                    : 'space-y-1 bg-black p-4 pb-6 text-center text-sm text-white',
            )}
        >
            <div>Veranstaltet durch den B-Side Kultur e.V.</div>

            <div className="flex justify-center gap-3 py-1">
                <span>{instagramLink}</span> <span>{facebookLink}</span>
            </div>

            <div className="flex justify-center gap-3">
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
