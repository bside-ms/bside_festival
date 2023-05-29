import type { ReactElement } from 'react';
import isEmptyString from 'lib/common/helper/isEmptyString';
import type { SerializableParticipant } from 'pages/bewerbungen/[idAndName]';

interface Props {
    application: SerializableParticipant;
}

const ApplicationDetailsMotivation = ({ application: { motivation } }: Props): ReactElement | null => {

    if (isEmptyString(motivation)) {
        return null;
    }

    return (
        <div className="mt-4">
            <div className="font-bold">Motivation</div>
            <div>{motivation}</div>
        </div>
    );
};

export default ApplicationDetailsMotivation;
