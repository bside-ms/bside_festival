import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import type { ReactElement } from 'react';

const AwarenessAlternativeLinks = (): ReactElement => {
    return (
        <div className="flex justify-between gap-2">
            <Link
                className="flex w-full cursor-pointer items-center gap-2 rounded-sm bg-black px-4 py-2 leading-3 text-white hover:bg-gray-800"
                href="/awareness/leichte-sprache"
            >
                <div className="pb-1 font-display text-base md:pb-3 md:text-4xl">Leichte Sprache</div>
                <div>
                    <FontAwesomeIcon className="inline-block w-3 md:w-6 md:pt-1" icon={faArrowRight} />
                </div>
            </Link>
            <Link
                className="flex w-full cursor-pointer items-center gap-2 rounded-sm bg-black px-4 leading-3 text-white hover:bg-gray-800"
                href="//awareness/english"
            >
                <div className="pb-1 font-display text-base md:pb-3 md:text-4xl">English version</div>
                <div>
                    <FontAwesomeIcon className="inline-block w-3 md:w-6 md:pt-1" icon={faArrowRight} />
                </div>
            </Link>
        </div>
    );
};

export default AwarenessAlternativeLinks;
