import { useParticipantsOverviewContext } from '@/components/participants/overview/ParticipantsOverviewContext';
import { typesFilterQueryName } from '@/lib/applications/filterQueryNames';
import isEmptyString from '@/lib/common/helper/isEmptyString';
import useIsMounted from '@/lib/common/hooks/useIsMounted';
import typeLabels from '@/lib/participants/typeLabels';
import type { Type } from '@prisma/client';
import type { ReactElement } from 'react';
import { useCallback, useEffect } from 'react';

const TypeToggle = ({ type }: { type: Type }): ReactElement => {
    const { filteredTypes, toggleFilteredType } = useParticipantsOverviewContext();

    const handleClick = useCallback(() => toggleFilteredType(type), [toggleFilteredType, type]);

    const active = filteredTypes.includes(type);

    return (
        <div
            className="rounded-2xl px-3 py-1 font-mono text-sm select-none hover:opacity-90 md:cursor-pointer"
            style={
                active
                    ? {
                          color: 'white',
                          backgroundColor: 'black',
                      }
                    : {
                          color: 'black',
                          backgroundColor: 'white',
                      }
            }
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
        <div className="mb-2 rounded-2xl border border-black bg-[#f0ee0a]">
            <div className="border-b border-black p-2 text-center text-2xl uppercase">Kategorie</div>

            <div className="flex flex-wrap gap-2 p-2">
                {actuallyAvailableTypes.map((availableType) => (
                    <TypeToggle key={availableType} type={availableType} />
                ))}
            </div>
        </div>
    );
};

export default ParticipantsOverviewTypesFilter;
