import isEmptyString from 'lib/common/helper/isEmptyString';
import type { ReactElement } from 'react';
import type { SerializableParticipant } from 'typings/SerializableParticipant';

interface Props {
    participant: SerializableParticipant;
}

const ParticipantCanProvideBackline = ({ participant: { backlineSharing } }: Props): ReactElement | null => {
    if (isEmptyString(backlineSharing)) {
        return null;
    }

    return (
        <div className="mt-4">
            <div className="font-display">Backline-Sharing</div>
            <div>{backlineSharing}</div>
        </div>
    );
};

export default ParticipantCanProvideBackline;
