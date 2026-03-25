import isNotEmptyString from '@/lib/common/helper/isNotEmptyString';
import type { SerializableParticipant } from '@/typings/SerializableParticipant';
import type { ReactElement } from 'react';

interface Props {
    application: SerializableParticipant;
}

const ApplicationDetailsDiversity = ({
    application: { flintaParticipantsCount, hasMarginalizedParticipants, diversityNotes },
}: Props): ReactElement | null => {
    return (
        <div>
            <div className="font-display">Diversität</div>
            <div>FLINTA* Personen: {flintaParticipantsCount}</div>
            <div>Personen anderer marginalisierter Gruppen: {hasMarginalizedParticipants ? 'ja' : 'nein'}</div>

            {isNotEmptyString(diversityNotes) && <div className="mt-1 whitespace-pre-wrap">{diversityNotes}</div>}
        </div>
    );
};

export default ApplicationDetailsDiversity;
