import type { ReactElement } from 'react';
import isEmptyString from 'lib/common/helper/isEmptyString';
import type { SerializableParticipant } from 'typings/SerializableParticipant';

interface Props {
    participant: SerializableParticipant;
}

const ParticipantMaterialExpenses = ({ participant: { materialExpenses } }: Props): ReactElement | null => {
    if (isEmptyString(materialExpenses)) {
        return null;
    }

    return (
        <>
            <div className="font-display">Materialkosten</div>
            <div>{materialExpenses}</div>
        </>
    );
};

export default ParticipantMaterialExpenses;
