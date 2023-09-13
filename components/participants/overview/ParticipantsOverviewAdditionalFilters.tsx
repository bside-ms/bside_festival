import { useCallback, useState } from 'react';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { ReactElement } from 'react';
import ParticipantsOverviewLocationFilter, {
    locationsFilterQueryName,
} from 'components/participants/overview/ParticipantsOverviewLocationFilter';
import useEffectOnMount from 'lib/common/hooks/useEffectOnMount';

const ParticipantsOverviewAdditionalFilters = (): ReactElement => {
    const [showAdditionalFilters, setShowAdditionalFilters] = useState(false);
    const toggleShowAdditionalFilters = useCallback(() => setShowAdditionalFilters((prevState) => !prevState), []);

    useEffectOnMount(() => {
        const url = new URL(window.location.href);

        if (url.searchParams.has(locationsFilterQueryName)) {
            setShowAdditionalFilters(true);
        }
    });

    return (
        <div className="mb-3">
            {showAdditionalFilters ? (
                <div>
                    <div className="flex">
                        <a onClick={toggleShowAdditionalFilters} className="cursor-pointer text-sm flex items-center gap-1 select-none">
                            Weitere Filter <FontAwesomeIcon className="w-2" icon={faChevronUp} />
                        </a>
                    </div>

                    <div className="mt-2">
                        <ParticipantsOverviewLocationFilter />
                    </div>
                </div>
            ) : (
                <div className="flex">
                    <a onClick={toggleShowAdditionalFilters} className="cursor-pointer text-sm flex items-center gap-1 select-none">
                        Weitere Filter <FontAwesomeIcon className="w-2" icon={faChevronDown} />
                    </a>
                </div>
            )}
        </div>
    );
};

export default ParticipantsOverviewAdditionalFilters;
