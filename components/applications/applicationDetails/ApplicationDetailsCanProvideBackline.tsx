import type { ReactElement } from 'react';
import isEmptyString from 'lib/common/helper/isEmptyString';
import type { SerializableParticipant } from 'typings/SerializableParticipant';

interface Props {
    application: SerializableParticipant;
}

const ApplicationDetailsCanProvideBackline = ({ application: { backlineSharing } }: Props): ReactElement | null => {
    if (isEmptyString(backlineSharing)) {
        return null;
    }

    return (
        <div className="mt-4">
            <div className="font-display">Backline-Sharing</div>
            <div>{backlineSharing}</div>
        </div>
    );
};

export default ApplicationDetailsCanProvideBackline;
