'use client';

import Badge from 'components/participants/details/Badge';
import ParticipantOverview from 'components/participants/overview/ParticipantOverview';
import { useParticipantsOverviewContext } from 'components/participants/overview/ParticipantsOverviewContext';
import ParticipantsOverviewLocationFilter from 'components/participants/overview/ParticipantsOverviewLocationFilter';
import ParticipantsOverviewTypesFilter from 'components/participants/overview/ParticipantsOverviewTypesFilter';
import cn from 'lib/common/helper/cn';
import Link from 'next/link';
import { ReactElement, useCallback, useState } from 'react';
import { IoTriangle } from 'react-icons/io5';
import { ToastContainer } from 'react-toastify';

interface Props {
    isLoggedIn: boolean;
}

const ParticipantsOverview = ({ isLoggedIn }: Props): ReactElement => {
    const { filteredParticipants, pinnedParticipantIds, areFiltersSet } = useParticipantsOverviewContext();

    const pinnedParticipants = filteredParticipants.filter(({ id }) => pinnedParticipantIds.includes(id));

    const [showFilter, setShowFilter] = useState(areFiltersSet);
    const toggleFilter = useCallback(() => setShowFilter((prevState) => !prevState), []);

    return (
        <>
            <div className="px-2 pb-4">
                <a className="mb-5 flex w-full cursor-pointer items-baseline gap-2" onClick={toggleFilter}>
                    Filter {showFilter ? 'ausblenden' : 'anzeigen'}
                    <span className={cn('text-xs', !showFilter && 'rotate-180')}>
                        <IoTriangle />
                    </span>
                </a>

                {showFilter && (
                    <div>
                        <ParticipantsOverviewTypesFilter />

                        <div className="mb-3">
                            <div className="mt-4">
                                <ParticipantsOverviewLocationFilter />
                            </div>

                            {/*<div className="mt-8 empty:mt-0">*/}
                            {/*    <ParticipantsOverviewLDateRangeFilter />*/}
                            {/*</div>*/}
                        </div>
                    </div>
                )}

                <div className="flex flex-wrap gap-4">
                    <Link href="/assets/2024-lageplan-b%20side%20festival.jpg" target="_blank" className="cursor-pointer">
                        <Badge label="Programm.PDF" backgroundColor="#ebc9de" />
                    </Link>

                    <Link href="/assets/b-side-festival 2024 programm.pdf" target="_blank" className="cursor-pointer">
                        <Badge label="Lageplan.PDF" backgroundColor="#ebc9de" />
                    </Link>
                </div>
            </div>

            <div className="mb-2 grid grid-cols-1 gap-4">
                {pinnedParticipants.map((participant) => (
                    <ParticipantOverview key={participant.id} participant={participant} isLoggedIn={isLoggedIn} />
                ))}

                {filteredParticipants
                    .filter(({ id }) => pinnedParticipants.length === 0 || !pinnedParticipantIds.includes(id))
                    .map((participant) => (
                        <ParticipantOverview key={participant.id} participant={participant} isLoggedIn={isLoggedIn} />
                    ))}
            </div>

            <ToastContainer
                position="bottom-center"
                autoClose={2000}
                hideProgressBar={true}
                newestOnTop={false}
                closeOnClick={true}
                rtl={false}
                pauseOnFocusLoss={false}
                draggable={false}
                pauseOnHover={false}
                theme="dark"
            />
        </>
    );
};

export default ParticipantsOverview;
