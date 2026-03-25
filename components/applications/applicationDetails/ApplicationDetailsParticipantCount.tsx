import type { SerializableParticipant } from '@/typings/SerializableParticipant';
import type { ReactElement } from 'react';

interface Props {
    application: SerializableParticipant;
}

const ApplicationDetailsParticipantCount = ({ application: { participantCount } }: Props): ReactElement | null => {
    return (
        <div>
            <div className="font-display">Personenanzahl</div>
            <div>{participantCount}</div>
        </div>
    );
};

export default ApplicationDetailsParticipantCount;
