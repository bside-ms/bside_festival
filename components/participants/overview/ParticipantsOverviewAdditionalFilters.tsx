import { useCallback, useState } from 'react';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Location } from '@prisma/client';
import type { ReactElement } from 'react';
import { useParticipantsOverviewContext } from 'components/participants/overview/ParticipantsOverviewContext';

const LocationIdToggle = ({ location }: { location: Location }): ReactElement | null => {
    const { filteredLocationIds, toggleFilteredLocationId } = useParticipantsOverviewContext();

    const handleClick = useCallback(() => toggleFilteredLocationId(location.id), [location.id, toggleFilteredLocationId]);

    const active = filteredLocationIds.includes(location.id);

    return (
        <div
            className="select-none uppercase md:cursor-pointer rounded-2xl border-2 bg-gray-200 border-gray-200 border-dashed text-sm px-3 py-1"
            style={{ borderColor: active ? '#444' : undefined }}
            onClick={handleClick}
        >
            {location.name}
        </div>
    );
};

const ParticipantsOverviewAdditionalFilters = (): ReactElement => {
    const { allLocations } = useParticipantsOverviewContext();

    const [showAdditionalFilters, setShowAdditionalFilters] = useState(false);
    const toggleShowAdditionalFilters = useCallback(() => setShowAdditionalFilters((prevState) => !prevState), []);

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
                        <div className="mb-1 underline">Veranstaltungsort</div>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {allLocations.map((location) => (
                                <LocationIdToggle key={location.id} location={location} />
                            ))}
                        </div>
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
