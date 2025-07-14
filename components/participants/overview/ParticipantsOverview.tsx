'use client';

import Badge from '@/components/participants/details/Badge';
import ParticipantOverview from '@/components/participants/overview/ParticipantOverview';
import { useParticipantsOverviewContext } from '@/components/participants/overview/ParticipantsOverviewContext';
import ParticipantsOverviewDateRangeFilter from '@/components/participants/overview/ParticipantsOverviewDateRangeFilter';
import ParticipantsOverviewLocationFilter from '@/components/participants/overview/ParticipantsOverviewLocationFilter';
import ParticipantsOverviewSearchTextFilter from '@/components/participants/overview/ParticipantsOverviewSearchTextFilter';
import ParticipantsOverviewTypesFilter from '@/components/participants/overview/ParticipantsOverviewTypesFilter';
import Link from 'next/link';
import { ReactElement, useCallback, useState } from 'react';
import { ToastContainer } from 'react-toastify';

interface Props {
    isLoggedIn: boolean;
}

const ParticipantsOverview = ({ isLoggedIn }: Props): ReactElement => {
    const { filteredParticipants, pinnedParticipantIds, areFiltersSet } = useParticipantsOverviewContext();

    const pinnedParticipants = filteredParticipants.filter(({ id }) => pinnedParticipantIds.includes(id));

    const [showFilter, setShowFilter] = useState(areFiltersSet);
    const toggleFilter = useCallback(() => setShowFilter((prevState) => !prevState), []);

    const handleFilterClick = useCallback(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setShowFilter(true);
    }, []);

    return (
        <>
            <div className="px-2 pb-4">
                <ParticipantsOverviewSearchTextFilter />

                {showFilter && (
                    <div>
                        <ParticipantsOverviewTypesFilter />

                        <div className="mb-3">
                            <div className="mt-4 empty:mt-0">
                                <ParticipantsOverviewDateRangeFilter />
                            </div>

                            <div className="mt-4">
                                <ParticipantsOverviewLocationFilter />
                            </div>
                        </div>

                        <div onClick={toggleFilter} className="mb-5 rounded-2xl border border-black bg-gray-200 p-2 text-center font-mono">
                            Filter ausblenden
                        </div>
                    </div>
                )}

                <div className="flex flex-wrap gap-4">
                    <Link href="/assets/b-side-festival 2024 programm.pdf" target="_blank" className="cursor-pointer">
                        <Badge label="Programm.PDF" backgroundColor="#ebc9de" />
                    </Link>

                    <Link href="/assets/2024-lageplan-b%20side%20festival.jpg" target="_blank" className="cursor-pointer">
                        <Badge label="Lageplan.PDF" backgroundColor="#ebc9de" />
                    </Link>
                </div>
            </div>

            {filteredParticipants.length > 0 && (
                <div className="empty-placeholder relative mb-2 grid grid-cols-1 gap-4">
                    <div className="sticky top-10 z-20">
                        <div
                            onClick={handleFilterClick}
                            className="absolute -top-5 right-5 flex h-17 w-17 items-center justify-center rounded-full bg-[#f0ee0a] font-mono text-sm"
                        >
                            Filtern
                        </div>
                    </div>

                    {pinnedParticipants.map((participant) => (
                        <ParticipantOverview key={participant.id} participant={participant} isLoggedIn={isLoggedIn} />
                    ))}

                    {filteredParticipants
                        .filter(({ id }) => pinnedParticipants.length === 0 || !pinnedParticipantIds.includes(id))
                        .map((participant) => (
                            <ParticipantOverview key={participant.id} participant={participant} isLoggedIn={isLoggedIn} />
                        ))}
                </div>
            )}

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
