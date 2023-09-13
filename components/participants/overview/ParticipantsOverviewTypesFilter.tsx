import { useCallback, useEffect } from 'react';
import type { Type } from '@prisma/client';
import type { ReactElement } from 'react';
import { useParticipantsOverviewContext } from 'components/participants/overview/ParticipantsOverviewContext';
import isEmptyString from 'lib/common/helper/isEmptyString';
import useIsMounted from 'lib/common/hooks/useIsMounted';
import typeColors from 'lib/participants/typeColors';
import typeLabels from 'lib/participants/typeLabels';

export const typesFilterQueryName = 'types';

const TypeToggle = ({ type }: { type: Type }): ReactElement => {
    const { filteredTypes, toggleFilteredType } = useParticipantsOverviewContext();

    const handleClick = useCallback(() => toggleFilteredType(type), [toggleFilteredType, type]);

    const active = filteredTypes.includes(type);

    return (
        <div
            className="select-none uppercase md:cursor-pointer rounded-2xl border-2 border-dashed text-sm px-3 py-1"
            style={{
                backgroundColor: typeColors[type],
                borderColor: active ? '#444' : typeColors[type],
            }}
            onClick={handleClick}
        >
            {typeLabels[type]}
        </div>
    );
};

const ParticipantsOverviewTypesFilter = (): ReactElement => {
    const { actuallyAvailableTypes, filteredTypes } = useParticipantsOverviewContext();

    const isMounted = useIsMounted();

    useEffect(() => {
        if (!isMounted) {
            return;
        }

        const currentUrl = new URL(window.location.href);

        const queryValue = filteredTypes.join(',');

        if (isEmptyString(queryValue)) {
            currentUrl.searchParams.delete(typesFilterQueryName);
        } else {
            currentUrl.searchParams.set(typesFilterQueryName, queryValue);
        }

        history.replaceState(null, '', currentUrl.toString());
    }, [isMounted, filteredTypes]);

    return (
        <div className="flex flex-wrap gap-2 mb-3">
            {actuallyAvailableTypes.map((availableType) => (
                <TypeToggle key={availableType} type={availableType} />
            ))}
        </div>
    );
};

export default ParticipantsOverviewTypesFilter;
