import { faFilePdf, faMapLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import type { ReactElement } from 'react';
import { ToastContainer } from 'react-toastify';
import ParticipantOverview from 'components/participants/overview/ParticipantOverview';
import { useParticipantsOverviewContext } from 'components/participants/overview/ParticipantsOverviewContext';
import ParticipantsOverviewLDateRangeFilter from 'components/participants/overview/ParticipantsOverviewDateRangeFilter';
import ParticipantsOverviewLocationFilter from 'components/participants/overview/ParticipantsOverviewLocationFilter';
import ParticipantsOverviewTypesFilter from 'components/participants/overview/ParticipantsOverviewTypesFilter';

const ParticipantsOverview = (): ReactElement => {
    const { filteredParticipants, pinnedParticipantIds } = useParticipantsOverviewContext();

    const pinnedParticipants = filteredParticipants.filter(({ id }) => pinnedParticipantIds.includes(id));

    return (
        <div>
            <div className="text-black font-display mb-8">
                <div className="text-2xl">
                    <Link href="/">B-Side Festival 2024</Link>
                </div>
                <div className="text-4xl font-bold">Programm</div>
            </div>

            <ParticipantsOverviewTypesFilter />

            <div className="mb-3">
                <div className="mt-4">
                    <ParticipantsOverviewLocationFilter />
                </div>

                <div className="mt-8 empty:mt-0">
                    <ParticipantsOverviewLDateRangeFilter />
                </div>
            </div>

            <div className="mt-5 mb-4 flex gap-4 flex-wrap">
                <Link
                    href="/assets/map.svg"
                    target="_blank"
                    className="inline-flex gap-2 items-center border border-gray-900 px-3 py-1 rounded-full cursor-pointer"
                >
                    <FontAwesomeIcon className="w-5" icon={faMapLocationDot} /> Lageplan
                </Link>

                <Link
                    href="/assets/b-side-festival-2023-programm.pdf"
                    target="_blank"
                    className="inline-flex gap-2 items-center border border-gray-900 px-3 py-1 rounded-full cursor-pointer"
                >
                    <FontAwesomeIcon className="w-5" icon={faFilePdf} /> Programmheft
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-5">
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
