import isEmptyString from '@/lib/common/helper/isEmptyString';
import type { SerializableParticipant } from '@/typings/SerializableParticipant';
import type { ReactElement } from 'react';

interface Props {
    application: SerializableParticipant;
}

const ApplicationDetailsMotivation = ({ application: { motivation } }: Props): ReactElement | null => {
    if (isEmptyString(motivation)) {
        return null;
    }

    return (
        <div>
            <div className="font-display">Motivation</div>
            <div className="whitespace-pre-wrap">{motivation}</div>
        </div>
    );
};

export default ApplicationDetailsMotivation;
