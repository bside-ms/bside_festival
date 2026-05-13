import type { ReactElement } from 'react';
import { TiPencil } from 'react-icons/ti';

interface Props {
    onClick: () => void;
}

const ApplicationDetailsEditButton = ({ onClick }: Props): ReactElement => (
    <button type="button" onClick={onClick} className="ml-1 inline-flex cursor-pointer text-sm text-gray-400 hover:text-sky-500">
        <TiPencil />
    </button>
);

export default ApplicationDetailsEditButton;
