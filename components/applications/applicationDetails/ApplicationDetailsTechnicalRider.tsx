import isEmptyString from 'lib/common/helper/isEmptyString';
import isNotEmptyString from 'lib/common/helper/isNotEmptyString';
import createPublicObjectUrl from 'lib/upload/createPublicObjectUrl';
import { default as NextLink } from 'next/link';
import type { ReactElement } from 'react';
import { FaFilePdf } from 'react-icons/fa6';
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
        <div>
            <div className="font-display">Technical Rider</div>

            {isNotEmptyString(technicalRider) && <div>{technicalRider}</div>}

            {isNotEmptyString(technicalRiderPdfUrl) && (
                <NextLink
                    href={technicalRiderPdfUrl}
                    target="_blank"
                    className="inline-flex cursor-pointer items-center rounded bg-gray-400/40 p-1 text-xl text-sky-500 hover:bg-gray-400/50"
                >
                    <FaFilePdf />
                </NextLink>
            )}
        </div>
    );
};

export default ApplicationDetailsTechnicalRider;
