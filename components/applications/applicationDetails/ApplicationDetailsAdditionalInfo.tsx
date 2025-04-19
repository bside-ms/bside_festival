import isEmptyString from 'lib/common/helper/isEmptyString';
import type { ReactElement } from 'react';
import type { SerializableParticipant } from 'typings/SerializableParticipant';

interface Props {
    application: SerializableParticipant;
}

const ApplicationDetailsAdditionalInfo = ({ application: { additionalInfo } }: Props): ReactElement | null => {
    if (isEmptyString(additionalInfo)) {
        return null;
    }

    return (
        <div>
            <div className="font-display">Weitere Infos</div>
            <div>{additionalInfo}</div>
        </div>
    );
};

export default ApplicationDetailsAdditionalInfo;
