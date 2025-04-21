import isEmptyString from 'lib/common/helper/isEmptyString';
import type { ReactElement } from 'react';
import type { SerializableParticipant } from 'typings/SerializableParticipant';

interface Props {
    application: SerializableParticipant;
}

const ApplicationDetailsCanProvideBackline = ({ application: { backlineSharing } }: Props): ReactElement | null => {
    if (isEmptyString(backlineSharing)) {
        return null;
    }

    return (
        <div>
            <div className="font-display">Backline-Sharing</div>
            <div className="whitespace-pre-wrap">{backlineSharing}</div>
        </div>
    );
};

export default ApplicationDetailsCanProvideBackline;
