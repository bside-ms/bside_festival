import Link from 'next/link';
import type { ReactElement } from 'react';
import ParticipantOverview from 'components/participants/overview/ParticipantOverview';
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
