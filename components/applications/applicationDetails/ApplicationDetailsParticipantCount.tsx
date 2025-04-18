import type { ReactElement } from 'react';
import isEmptyString from 'lib/common/helper/isEmptyString';
import type { SerializableParticipant } from 'typings/SerializableParticipant';

interface Props {
    application: SerializableParticipant;
}

const ApplicationDetailsParticipantCount = ({ application: { participantCount } }: Props): ReactElement | null => {
    if (isEmptyString(participantCount)) {
        return null;
    }

    return (
        <div>
            <div className="font-display">Personenanzahl</div>
            <div>{participantCount}</div>
        </div>
    );
};

export default ApplicationDetailsParticipantCount;
