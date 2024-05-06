import type { ReactElement } from 'react';
import type { SerializableParticipant } from 'typings/SerializableParticipant';

interface Props {
    application: SerializableParticipant;
}

const ApplicationDetailsCanProvideBackline = ({ application: { canProvideBackline } }: Props): ReactElement | null => {
    if (!canProvideBackline) {
        return null;
    }

    return <div className="mt-4">Die Künstler:innen haben angegeben, Teile der Backline bereitstellen zu können!</div>;
};

export default ApplicationDetailsCanProvideBackline;
