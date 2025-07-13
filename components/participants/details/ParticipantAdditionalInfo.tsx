import isEmptyString from '@/lib/common/helper/isEmptyString';
import type { SerializableParticipant } from '@/typings/SerializableParticipant';
import type { ReactElement } from 'react';

interface Props {
    participant: SerializableParticipant;
}

const ParticipantAdditionalInfo = ({ participant: { additionalInfo } }: Props): ReactElement | null => {
    if (isEmptyString(additionalInfo)) {
        return null;
    }

    return (
        <div className="mt-4">
            <div className="font-bold">Weitere Infos</div>
            <div>{additionalInfo}</div>
        </div>
    );
};

export default ParticipantAdditionalInfo;
