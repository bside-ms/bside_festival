import { useCallback, useEffect, useState } from 'react';
import type { Type } from '@prisma/client';
import type { ReactElement } from 'react';
import { useApplicationsOverviewContext } from 'components/applications/applicationsOverview/ApplicationsOverviewContext';
import availableTypes from 'lib/applications/availableTypes';
import isEmptyString from 'lib/common/helper/isEmptyString';
import useEffectOnMount from 'lib/common/hooks/useEffectOnMount';
import typeLabels from 'lib/participants/typeLabels';

const TypeToggle = ({ type }: { type: Type }): ReactElement => {

    const { filteredTypes, toggleFilteredType } = useApplicationsOverviewContext();

    const handleClick = useCallback(() => toggleFilteredType(type), [toggleFilteredType, type]);

    const active = filteredTypes.includes(type);

    return (
        <div
            className={`select-none md:cursor-pointer rounded-2xl border border-gray-400 text-sm py-1 px-4 bg-gray-100 ${active ? '!bg-gray-600 !text-gray-100' : ''}`}
            onClick={handleClick}
        >
            {typeLabels[type]}
        </div>
    );
};

const ApplicationsOverviewSearchText = (): ReactElement => {

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
            currentUrl.searchParams.delete('types');
        } else {
            currentUrl.searchParams.set('types', queryValue);
        }

        history.replaceState(null, '', currentUrl.toString());
    }, [isMounted, filteredTypes]);

    return (
        <div className="flex flex-wrap gap-2 mb-4">
            {availableTypes.map(availableType => (
                <TypeToggle key={availableType} type={availableType} />
            ))}
        </div>
    );
};

export default ApplicationsOverviewSearchText;
