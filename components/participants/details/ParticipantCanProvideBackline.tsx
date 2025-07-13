import isEmptyString from '@/lib/common/helper/isEmptyString';
import type { SerializableParticipant } from '@/typings/SerializableParticipant';
import type { ReactElement } from 'react';

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
            <div className="whitespace-pre-wrap">{backlineSharing}</div>
        </div>
    );
};

export default ParticipantCanProvideBackline;
