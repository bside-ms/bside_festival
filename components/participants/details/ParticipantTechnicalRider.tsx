import isEmptyString from '@/lib/common/helper/isEmptyString';
import isNotEmptyString from '@/lib/common/helper/isNotEmptyString';
import createPublicObjectUrl from '@/lib/upload/createPublicObjectUrl';
import type { SerializableParticipant } from '@/typings/SerializableParticipant';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { default as NextLink } from 'next/link';
import type { ReactElement } from 'react';

interface Props {
    participant: SerializableParticipant;
}

const ParticipantTechnicalRider = ({ participant: { technicalRider, technicalRiderFileName } }: Props): ReactElement | null => {
    if (isEmptyString(technicalRider) && isEmptyString(technicalRiderFileName)) {
        return null;
    }

    const technicalRiderPdfUrl = isEmptyString(technicalRiderFileName) ? null : createPublicObjectUrl(technicalRiderFileName);

    return (
        <div className="mt-4">
            <div className="font-display">Technical Rider</div>

            {isNotEmptyString(technicalRider) && <div className="whitespace-pre-wrap">{technicalRider}</div>}

            {isNotEmptyString(technicalRiderPdfUrl) && (
                <NextLink href={technicalRiderPdfUrl}>
                    <FontAwesomeIcon className="inline-block w-8 p-1" icon={faFilePdf} />
                </NextLink>
            )}
        </div>
    );
};

export default ParticipantTechnicalRider;
