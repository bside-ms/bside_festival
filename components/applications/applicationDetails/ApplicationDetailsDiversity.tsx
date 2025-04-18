import type { ReactElement } from 'react';
import type { SerializableParticipant } from 'typings/SerializableParticipant';
import isNotEmptyString from 'lib/common/helper/isNotEmptyString';

interface Props {
    application: SerializableParticipant;
}

const ApplicationDetailsDiversity = ({
    application: { hasFlintaParticipants, hasMarginalizedParticipants, diversityNotes },
}: Props): ReactElement | null => {
    return (
        <div>
            <div className="font-display">Diversität</div>
            <div>FLINTA* Personen: {hasFlintaParticipants ? 'ja' : 'nein'}</div>
            <div>Personen anderer marginalisierter Gruppen: {hasMarginalizedParticipants ? 'ja' : 'nein'}</div>

            {isNotEmptyString(diversityNotes) && <div className="mt-1">{diversityNotes}</div>}
        </div>
    );
};

export default ApplicationDetailsDiversity;
