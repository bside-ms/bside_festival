import type { ReactElement } from 'react';
import isEmptyString from 'lib/common/helper/isEmptyString';
import type { SerializableParticipant } from 'typings/SerializableParticipant';

interface Props {
    application: SerializableParticipant;
}

const ApplicationDetailsMaterialExpenses = ({ application: { materialExpenses } }: Props): ReactElement | null => {
    if (isEmptyString(materialExpenses)) {
        return null;
    }

    return (
        <div>
            <div className="font-display">Materialkosten</div>
            <div>{materialExpenses}</div>
        </div>
    );
};

export default ApplicationDetailsMaterialExpenses;
