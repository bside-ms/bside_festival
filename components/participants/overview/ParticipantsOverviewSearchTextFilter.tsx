import { useParticipantsOverviewContext } from '@/components/participants/overview/ParticipantsOverviewContext';
import { textFilterQueryName } from '@/lib/applications/filterQueryNames';
import isEmptyString from '@/lib/common/helper/isEmptyString';
import isNotEmptyString from '@/lib/common/helper/isNotEmptyString';
import useEffectOnMount from '@/lib/common/hooks/useEffectOnMount';
import type { ChangeEvent, ReactElement } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

const ParticipantsOverviewSearchTextFilter = (): ReactElement => {
    const { filteredText, setFilteredText } = useParticipantsOverviewContext();

    const [isMounted, setIsMounted] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);

    const handleSearchChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            setFilteredText(event.target.value);
        },
        [setFilteredText],
    );

    useEffectOnMount(() => {
        setIsMounted(true);
    });

    const handleClearSearchFilter = useCallback(() => {
        setFilteredText(null);

        if (inputRef.current !== null) {
            inputRef.current.value = '';
        }
    }, [setFilteredText]);

    useEffect(() => {
        if (!isMounted) {
            return;
        }

        const currentUrl = new URL(window.location.href);

        if (isEmptyString(filteredText)) {
            currentUrl.searchParams.delete(textFilterQueryName);
        } else {
            currentUrl.searchParams.set(textFilterQueryName, filteredText);
        }

        history.replaceState(null, '', currentUrl.toString());
    }, [isMounted, filteredText]);

    return (
        <div className="relative mb-4 flex items-center gap-2">
            <input
                type="text"
                placeholder="Suchen…"
                className="w-full rounded-xl border border-none border-gray-300 bg-gray-50 pt-2 pr-7 pb-1 pl-3 font-mono text-sm text-gray-900 ring-0 outline-0"
                onChange={handleSearchChange}
                ref={inputRef}
                value={filteredText ?? ''}
            />

            {isNotEmptyString(filteredText) && (
                <div onClick={handleClearSearchFilter} className="absolute right-2 text-gray-600 md:cursor-pointer">
                    ✕
                </div>
            )}
        </div>
    );
};

export default ParticipantsOverviewSearchTextFilter;
