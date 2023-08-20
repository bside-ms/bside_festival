import { faAccessibleIcon } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { ReactElement } from 'react';

const AccessibleIcon = (): ReactElement => {

    return (
        <div className="inline-block relative h-5 w-5 border border-black rounded-full">
            <FontAwesomeIcon className="absolute top-1/2 -translate-y-1/2 w-3 left-1/2 -translate-x-1/2" icon={faAccessibleIcon} />
        </div>
    );
};

export default AccessibleIcon;
