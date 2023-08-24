import { useCallback, useState } from 'react';
import { faMapLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import Link from 'next/link';
import type { ReactElement } from 'react';
import ParticipantOverview from 'components/participants/overview/ParticipantOverview';
import { useParticipantsOverviewContext } from 'components/participants/overview/ParticipantsOverviewContext';
import ParticipantsOverviewTypesFilter from 'components/participants/overview/ParticipantsOverviewTypesFilter';
import typeLabels from 'lib/participants/typeLabels';

const ParticipantsOverview = (): ReactElement => {

    const [showMap, setShowMap] = useState(false);
    const toggleShowMap = useCallback(() => setShowMap(prevState => !prevState), []);

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

            <div className="mt-5 mb-2">
                <a onClick={toggleShowMap} className="inline-flex gap-2 items-center border border-gray-900 px-3 py-1 rounded-full cursor-pointer">
                    <FontAwesomeIcon className="w-5" icon={faMapLocationDot} /> Lageplan
                </a>

                {showMap && (
                    <div className="p-5">
                        <div className="bg-white bg-opacity-50 p-10">
                            <Image
                                src="/assets/map.svg"
                                alt={typeLabels.Reading}
                                width="128"
                                height="128"
                                layout="responsive"
                                className="object-cover"
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 gap-5">
                {filteredParticipants
                    .map(participant => (
                        <ParticipantOverview
                            key={participant.id}
                            participant={participant}
                        />
                    ))}
            </div>
        </div>
    );
};

export default ParticipantsOverview;
