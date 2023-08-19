import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import type { ReactElement } from 'react';

const AwarenessAlternativeLinks = (): ReactElement => {

    return (
        <div className="flex gap-2 justify-between">
            <Link
                className="w-full cursor-pointer hover:bg-gray-800 bg-black text-white px-4 py-2 rounded-sm flex items-center gap-2 leading-3"
                href="/awareness/leichte-sprache"
            >
                <div className="font-display text-base md:text-4xl pb-1 md:pb-3">Leichte Sprache</div>
                <div><FontAwesomeIcon className="w-3 md:w-6 md:pt-1 inline-block" icon={faArrowRight} /></div>
            </Link>
            <Link
                className="w-full cursor-pointer hover:bg-gray-800 bg-black text-white px-4 rounded-sm flex items-center gap-2 leading-3"
                href="//awareness/english"
            >
                <div className="font-display text-base md:text-4xl pb-1 md:pb-3">English version</div>
                <div><FontAwesomeIcon className="w-3 md:w-6 md:pt-1 inline-block" icon={faArrowRight} /></div>
            </Link>
        </div>
    );
};

export default AwarenessAlternativeLinks;
