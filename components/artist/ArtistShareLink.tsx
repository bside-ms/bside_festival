import { useCallback, useState } from 'react';
import { faShareAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import copy from 'copy-to-clipboard';
import type { ReactElement } from 'react';
import type Artist from 'lib/strapi/typings/Artist';

interface Props {
    artist: Artist;
    applicationType: string;
}

const ArtistShareLink = ({ artist, applicationType }: Props): ReactElement => {

    const [showCopyHint, setShowCopyHint] = useState(false);

    const hideCopyHint = useCallback(() => setShowCopyHint(false), [setShowCopyHint]);

    const artistShareLink = `${window.location.origin}/artists/${applicationType}/${artist.id}`;

    const handleCopy = useCallback(() => {
        setShowCopyHint(true);
        copy(artistShareLink);

        window.setTimeout(() => hideCopyHint(), 600);
    }, [artistShareLink, hideCopyHint]);

    return (
        <a
            className="space-x-2 text-gray-600 cursor-pointer hover:text-gray-800 whitespace-nowrap relative"
            onClick={handleCopy}
        >
            <span>Teilen</span><FontAwesomeIcon icon={faShareAlt} />

            <div
                className={`
                    pl-2
                    absolute 
                    left-full 
                    top-0 
                    leading-4 
                    text-sm 
                    text-pink-500 
                    transition-opacity 
                    ease-out 
                    duration-300 
                    ${showCopyHint ? 'opacity-100' : 'opacity-0'}
                `}
            >
                Link kopiert!
            </div>
        </a>
    );
};

export default ArtistShareLink;
