import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { default as NextLink } from 'next/link';
import type { ReactElement } from 'react';
import isEmptyString from 'lib/common/helper/isEmptyString';
import isNotEmptyString from 'lib/common/helper/isNotEmptyString';
import createPublicObjectUrl from 'lib/upload/createPublicObjectUrl';
import type { SerializableParticipant } from 'typings/SerializableParticipant';

interface Props {
    application: SerializableParticipant;
}

const ApplicationDetailsTechnicalRider = ({ application: { technicalRider, technicalRiderFileName } }: Props): ReactElement | null => {
    if (isEmptyString(technicalRider) && isEmptyString(technicalRiderFileName)) {
        return null;
    }

    const technicalRiderPdfUrl = isEmptyString(technicalRiderFileName) ? null : createPublicObjectUrl(technicalRiderFileName);

    return (
        <div className="mt-4">
            <div className="font-display">Technical Rider</div>

            {isNotEmptyString(technicalRider) && <div>{technicalRider}</div>}

            {isNotEmptyString(technicalRiderPdfUrl) && (
                <NextLink href={technicalRiderPdfUrl} target="_blank">
                    <FontAwesomeIcon className="inline-block w-8 p-1" icon={faFilePdf} />
                </NextLink>
            )}
        </div>
    );
};

export default ApplicationDetailsTechnicalRider;
