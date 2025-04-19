import type { Type } from '@prisma/client';
import { useApplicationsOverviewContext } from 'components/applications/applicationsOverview/ApplicationsOverviewContext';
import { typesFilterQueryName } from 'components/participants/overview/ParticipantsOverviewTypesFilter';
import availableTypes from 'lib/applications/availableTypes';
import isEmptyString from 'lib/common/helper/isEmptyString';
import useEffectOnMount from 'lib/common/hooks/useEffectOnMount';
import typeColors from 'lib/participants/typeColors';
import typeLabels from 'lib/participants/typeLabels';
import type { ReactElement } from 'react';
import { useCallback, useEffect, useState } from 'react';

const TypeToggle = ({ type }: { type: Type }): ReactElement => {
    const { filteredTypes, toggleFilteredType } = useApplicationsOverviewContext();

    const handleClick = useCallback(() => toggleFilteredType(type), [toggleFilteredType, type]);

    const active = filteredTypes.includes(type);

    return (
        <div
            className="rounded-2xl border-2 border-dashed px-3 py-1 text-sm uppercase select-none hover:opacity-90 md:cursor-pointer"
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

const ApplicationsOverviewTypesFilter = (): ReactElement => {
    const { filteredTypes } = useApplicationsOverviewContext();

    const [isMounted, setIsMounted] = useState(false);

    useEffectOnMount(() => {
        setIsMounted(true);
    });

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
        <div className="mb-3 flex flex-wrap gap-2">
            {availableTypes.map((availableType) => (
                <TypeToggle key={availableType} type={availableType} />
            ))}
        </div>
    );
};

export default ApplicationsOverviewTypesFilter;
