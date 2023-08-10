import type { ReactElement } from 'react';
import isEmptyString from 'lib/common/helper/isEmptyString';
import type { SerializableParticipant } from 'typings/SerializableParticipant';

interface Props {
    application: SerializableParticipant;
}

const AdditionalInfo = ({ application: { additionalInfo } }: Props): ReactElement | null => {

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

export default AdditionalInfo;
