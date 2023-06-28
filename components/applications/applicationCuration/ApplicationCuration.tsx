import type { ReactElement } from 'react';
import ApplicationCurationForm from 'components/applications/applicationCuration/ApplicationCurationForm';
import type { SerializableParticipant } from 'typings/SerializableParticipant';

interface Props {
    application: SerializableParticipant;
}

const ApplicationCuration = ({ application }: Props): ReactElement => {

    return (
        <div>
            <div className="font-display">
                Kuration
            </div>

            <ApplicationCurationForm application={application} />
        </div>
    );
};

export default ApplicationCuration;
