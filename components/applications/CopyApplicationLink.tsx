import { useCallback, useRef, useState } from 'react';
import { faShareAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Popover } from '@mui/material';
import type { ReactElement } from 'react';
import copy from 'copy-to-clipboard';

interface Props {
    applicationId: number;
}

const CopyApplicationLink = ({ applicationId }: Props): ReactElement => {

    const [showPopOver, setShowPopOver] = useState(false);

    const handleHidePopOver = useCallback(() => setShowPopOver(false), [setShowPopOver]);

    const popOverRefElement = useRef<HTMLAnchorElement>(null);

    const applicationLink = `${window.location.origin}/bewerbung/${applicationId}`;

    const handleCopy = useCallback(() => {
        setShowPopOver(true);
        copy(applicationLink);

        window.setTimeout(
            () => handleHidePopOver(),
            600
        );
    }, [applicationLink]);

    return (
        <>
            <a
                className="space-x-2 text-gray-600 cursor-pointer hover:text-gray-800"
                onClick={handleCopy}
                ref={popOverRefElement}
            >
                <span>Teilen</span><FontAwesomeIcon icon={faShareAlt} />
            </a>

            <Popover
                PaperProps={{
                    className: 'bg-gray-800 text-white',
                    sx: {
                        p: 0.5,
                        fontSize: 12,
                        backgroundColor: 'gray',
                        color: 'white',
                        boxShadow: 'none',
                    },
                }}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                open={showPopOver}
                onClose={handleHidePopOver}
                anchorEl={popOverRefElement.current}
            >
                Link kopiert
            </Popover>
        </>
    );
};

export default CopyApplicationLink;
