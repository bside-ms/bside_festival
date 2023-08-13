import type { ReactElement } from 'react';
import ParticipantOverview from 'components/participants/overview/ParticipantOverview';
import { useParticipantsOverviewContext } from 'components/participants/overview/ParticipantsOverviewContext';
import ParticipantsOverviewTypesFilter from 'components/participants/overview/ParticipantsOverviewTypesFilter';

const ParticipantsOverview = (): ReactElement => {

    const { filteredParticipants } = useParticipantsOverviewContext();

    return (
        <div>
            <div className="text-3xl mb-5 font-display">
                Programm
            </div>

            <ParticipantsOverviewTypesFilter />

            <div className="grid grid-cols-1 gap-5">
                {filteredParticipants
                    .map(application => (
                        <ParticipantOverview
                            key={application.id}
                            application={application}
                        />
                    ))}
            </div>
        </div>
    );
};

export default ParticipantsOverview;
