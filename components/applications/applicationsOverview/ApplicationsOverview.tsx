import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Participant } from '@prisma/client';
import Fuse from 'fuse.js';
import type { ChangeEvent, ReactElement } from 'react';
import Application from 'components/applications/applicationsOverview/Application';
import isEmptyString from 'lib/common/helper/isEmptyString';
import isNotEmptyString from 'lib/common/helper/isNotEmptyString';
import useEffectOnMount from 'lib/common/hooks/useEffectOnMount';

interface Props {
    applications: Array<Participant>;
}

const ApplicationsOverview = ({ applications }: Props): ReactElement => {

    const [isMounted, setIsMounted] = useState(false);

    const [searchText, setSearchText] = useState<string | null>(null);

    const inputRef = useRef<HTMLInputElement>(null);

    const handleSearchChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {

        setSearchText(event.target.value);
    }, []);

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
    }, []);

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

    const filteredApplications = useMemo<Array<Fuse.FuseResult<Participant>>>(() => {

        if (isEmptyString(searchText)) {
            return applications.map<Fuse.FuseResult<Participant>>((application, index) => ({
                item: application,
                refIndex: index,
            }));
        }

        const fuse = new Fuse(applications, {
            keys: ['name'],
            shouldSort: true,
        });

        return fuse.search(searchText);
    }, [applications, searchText]);

    return (
        <div>
            <div className="text-xl mb-2">Bewerbungen</div>

            <div className="flex gap-2 items-center mb-4">
                <input
                    type="text"
                    placeholder="Suchen"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2 outline-0"
                    onChange={handleSearchChange}
                    ref={inputRef}
                />
                {isNotEmptyString(searchText) && (
                    <div
                        onClick={handleClearSearchFilter}
                        className="md:cursor-pointer text-gray-800"
                    >
                        Alle anzeigen
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredApplications
                    .map(application => (
                        <Application
                            key={application.item.id}
                            application={application.item}
                            searchText={searchText}
                        />
                    ))}
            </div>
        </div>
    );
};

export default ApplicationsOverview;
