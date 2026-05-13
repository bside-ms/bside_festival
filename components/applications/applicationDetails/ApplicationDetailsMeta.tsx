import formatDate from '@/lib/common/helper/formatDate';
import isNotEmptyString from '@/lib/common/helper/isNotEmptyString';
import type { SerializableParticipant } from '@/typings/SerializableParticipant';
import type { ReactElement } from 'react';

interface Props {
    application: SerializableParticipant;
}

const dateFormat = 'dd.MM.yyyy HH:mm';

const ApplicationDetailsMeta = ({ application: { appliedAt, updatedAt, emailVerified } }: Props): ReactElement => (
    <div>
        <div className="font-display">Metadaten</div>

        {isNotEmptyString(appliedAt) && <div>Eingegangen: {formatDate(appliedAt, dateFormat)}</div>}

        <div>Aktualisiert: {formatDate(updatedAt, dateFormat)}</div>

        <div>E-Mail bestätigt: {emailVerified === null ? 'nein' : `ja, am ${formatDate(emailVerified, dateFormat)}`}</div>
    </div>
);

export default ApplicationDetailsMeta;
