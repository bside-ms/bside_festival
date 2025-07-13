import isEmptyString from '@/lib/common/helper/isEmptyString';
import type { SerializableParticipant } from '@/typings/SerializableParticipant';
import type { ReactElement } from 'react';

interface Props {
    application: SerializableParticipant;
}

const ApplicationDetailsAllergies = ({ application: { allergies } }: Props): ReactElement | null => {
    if (isEmptyString(allergies)) {
        return null;
    }

    return (
        <div>
            <div className="font-display">Allergien</div>
            <div className="whitespace-pre-wrap">{allergies}</div>
        </div>
    );
};

export default ApplicationDetailsAllergies;
