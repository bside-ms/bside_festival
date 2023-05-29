import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { default as NextLink } from 'next/link';
import type { ReactElement } from 'react';
import isEmptyString from 'lib/common/helper/isEmptyString';
import isNotEmptyString from 'lib/common/helper/isNotEmptyString';
import createPublicObjectUrl from 'lib/upload/createPublicObjectUrl';
import type { SerializableParticipant } from 'pages/bewerbungen/[idAndName]';

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
            <div className="font-bold">Technical Rider</div>

            {isNotEmptyString(technicalRider) && (
                <div>{technicalRider}</div>
            )}

            {isNotEmptyString(technicalRiderPdfUrl) && (
                <NextLink href={technicalRiderPdfUrl}>
                    <FontAwesomeIcon icon={faFilePdf} />
                </NextLink>
            )}
        </div>
    );
};

export default ApplicationDetailsTechnicalRider;
