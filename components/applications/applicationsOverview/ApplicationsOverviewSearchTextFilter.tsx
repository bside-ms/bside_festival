import { useCallback, useEffect, useRef, useState } from 'react';
import type { ChangeEvent, ReactElement } from 'react';
import { useApplicationsOverviewContext } from 'components/applications/applicationsOverview/ApplicationsOverviewContext';
import isEmptyString from 'lib/common/helper/isEmptyString';
import isNotEmptyString from 'lib/common/helper/isNotEmptyString';
import useEffectOnMount from 'lib/common/hooks/useEffectOnMount';

const ApplicationsOverviewSearchTextFilter = (): ReactElement => {
    const { searchText, setSearchText } = useApplicationsOverviewContext();

    const [isMounted, setIsMounted] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);

    const handleSearchChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            setSearchText(event.target.value);
        },
        [setSearchText],
    );

    useEffectOnMount(() => {
        const queryParams = new URLSearchParams(window.location.search);

        const initialSearchText = queryParams.get('search');

        if (isNotEmptyString(initialSearchText)) {
            setSearchText(queryParams.get('search'));

            if (inputRef.current !== null) {
                inputRef.current.value = initialSearchText;
            }
        }

        setIsMounted(true);
    });

    const handleClearSearchFilter = useCallback(() => {
        setSearchText(null);

        if (inputRef.current !== null) {
            inputRef.current.value = '';
        }
    }, [setSearchText]);

    useEffect(() => {
        if (!isMounted) {
            return;
        }

        const currentUrl = new URL(window.location.href);

        if (isEmptyString(searchText)) {
            currentUrl.searchParams.delete('search');
        } else {
            currentUrl.searchParams.set('search', searchText);
        }

        history.replaceState(null, '', currentUrl.toString());
    }, [isMounted, searchText]);

    return (
        <div className="flex gap-2 items-center mb-4">
            <input
                type="text"
                placeholder="Suchen"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2 outline-0 w-full md:w-60"
                onChange={handleSearchChange}
                ref={inputRef}
            />
            {isNotEmptyString(searchText) && (
                <div onClick={handleClearSearchFilter} className="md:cursor-pointer text-gray-800">
                    Alle anzeigen
                </div>
            )}
        </div>
    );
};

export default ApplicationsOverviewSearchTextFilter;
