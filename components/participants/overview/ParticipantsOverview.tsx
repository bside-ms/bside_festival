import type { ReactElement } from 'react';
import ParticipantOverview from 'components/participants/overview/ParticipantOverview';
import { useApplicationsOverviewContext } from 'components/participants/overview/ParticipantsOverviewContext';
import ParticipantsOverviewTypesFilter from 'components/participants/overview/ParticipantsOverviewTypesFilter';

const ParticipantsOverview = (): ReactElement => {

    const { filteredApplications } = useApplicationsOverviewContext();

    return (
        <div>
            <div className="text-3xl mb-5 font-display">
                Programm
            </div>

            <ParticipantsOverviewTypesFilter />

            <div className="grid grid-cols-1 gap-5">
                {filteredApplications
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
