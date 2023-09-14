import { faFilePdf, faMapLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import type { ReactElement } from 'react';
import ParticipantOverview from 'components/participants/overview/ParticipantOverview';
import ParticipantsOverviewAdditionalFilters from 'components/participants/overview/ParticipantsOverviewAdditionalFilters';
import { useParticipantsOverviewContext } from 'components/participants/overview/ParticipantsOverviewContext';
import ParticipantsOverviewTypesFilter from 'components/participants/overview/ParticipantsOverviewTypesFilter';

const ParticipantsOverview = (): ReactElement => {
    const { filteredParticipants } = useParticipantsOverviewContext();

    return (
        <div>
            <div className="text-black font-display mb-8">
                <div className="text-2xl">
                    <Link href="/">B-Side Festival 2023</Link>
                </div>
                <div className="text-4xl font-bold">Programm</div>
            </div>

            <ParticipantsOverviewTypesFilter />

            <ParticipantsOverviewAdditionalFilters />

            <div className="mt-5 mb-4 flex gap-4">
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
                {filteredParticipants.map((participant) => (
                    <ParticipantOverview key={participant.id} participant={participant} />
                ))}
            </div>
        </div>
    );
};

export default ParticipantsOverview;
