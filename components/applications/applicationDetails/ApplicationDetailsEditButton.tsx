import type { MouseEvent, ReactElement } from 'react';
import { useCallback } from 'react';
import { TiPencil } from 'react-icons/ti';

interface Props {
    onClick: () => void;
}

const ApplicationDetailsEditButton = ({ onClick }: Props): ReactElement => {
    const handleClick = useCallback(
        (event: MouseEvent<HTMLButtonElement>) => {
            event.stopPropagation();
            onClick();
        },
        [onClick],
    );

    return (
        <button type="button" onClick={handleClick} className="ml-1 inline-flex cursor-pointer text-sm text-gray-400 hover:text-sky-500">
            <TiPencil />
        </button>
    );
};

export default ApplicationDetailsEditButton;
