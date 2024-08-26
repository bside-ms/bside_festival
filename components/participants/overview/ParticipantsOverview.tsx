import { faFilePdf, faMapLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { ReactElement, useCallback, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import ParticipantOverview from 'components/participants/overview/ParticipantOverview';
import { useParticipantsOverviewContext } from 'components/participants/overview/ParticipantsOverviewContext';
import ParticipantsOverviewLDateRangeFilter from 'components/participants/overview/ParticipantsOverviewDateRangeFilter';
import ParticipantsOverviewLocationFilter from 'components/participants/overview/ParticipantsOverviewLocationFilter';
import ParticipantsOverviewTypesFilter from 'components/participants/overview/ParticipantsOverviewTypesFilter';
import { IoTriangle } from 'react-icons/io5';
import cn from 'lib/common/helper/cn';

const ParticipantsOverview = (): ReactElement => {
    const { filteredParticipants, pinnedParticipantIds, areFiltersSet } = useParticipantsOverviewContext();

    const pinnedParticipants = filteredParticipants.filter(({ id }) => pinnedParticipantIds.includes(id));

    const [showFilter, setShowFilter] = useState(areFiltersSet);
    const toggleFilter = useCallback(() => setShowFilter((prevState) => !prevState), []);

    return (
        <div>
            <div className="bg-white/60 px-3 py-7">
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

                            <div className="mt-8 empty:mt-0">
                                <ParticipantsOverviewLDateRangeFilter />
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-5 flex flex-wrap gap-4">
                    <Link
                        href="/assets/2024-lageplan-b%20side%20festival.jpg"
                        target="_blank"
                        className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-gray-900 px-3 py-1"
                    >
                        <FontAwesomeIcon className="w-5" icon={faMapLocationDot} /> Lageplan
                    </Link>

                    <Link
                        href="/assets/b-side-festival 2024 programm.pdf"
                        target="_blank"
                        className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-gray-900 px-3 py-1 hover:bg-white/10"
                    >
                        <FontAwesomeIcon className="w-5" icon={faFilePdf} /> Programmheft
                    </Link>
                </div>
            </div>

            <div className="mb-20 grid grid-cols-1 gap-10">
                {pinnedParticipants.map((participant) => (
                    <ParticipantOverview key={participant.id} participant={participant} />
                ))}

                {filteredParticipants
                    .filter(({ id }) => pinnedParticipants.length === 0 || !pinnedParticipantIds.includes(id))
                    .map((participant) => (
                        <ParticipantOverview key={participant.id} participant={participant} />
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
        </div>
    );
};

export default ParticipantsOverview;
