import formatDate from '@/lib/common/helper/formatDate';
import isNotEmptyString from '@/lib/common/helper/isNotEmptyString';
import type { SerializableParticipant } from '@/typings/SerializableParticipant';
import Link from 'next/link';
import type { ReactElement } from 'react';

interface Props {
    application: SerializableParticipant;
    changeLogHref?: string;
}

const dateFormat = 'dd.MM.yyyy HH:mm';

const ApplicationDetailsMeta = ({ application: { id, appliedAt, updatedAt, emailVerified }, changeLogHref }: Props): ReactElement => (
    <div>
        <div className="font-display">Metadaten</div>

        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span>ID: {id}</span>
            {changeLogHref !== undefined && (
                <Link className="text-sm text-black underline-offset-2 hover:underline" href={changeLogHref}>
                    Änderungslog
                </Link>
            )}
        </div>

        {isNotEmptyString(appliedAt) && <div>Eingegangen: {formatDate(appliedAt, dateFormat)}</div>}

        <div>Aktualisiert: {formatDate(updatedAt, dateFormat)}</div>

        <div>E-Mail bestätigt: {emailVerified === null ? 'nein' : `ja, am ${formatDate(emailVerified, dateFormat)}`}</div>
    </div>
);

export default ApplicationDetailsMeta;
